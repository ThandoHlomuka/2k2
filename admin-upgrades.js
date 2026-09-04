// ==========================================
// 2k2 - Admin: Provider Upgrade Approvals
// Renders #page-admin-upgrades table and
// handles approve / reject actions.
// ==========================================
(function () {
  'use strict';

  function getClient() {
    return window._2k2.getSupabase ? window._2k2.getSupabase() : null;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  async function loadRequests() {
    const client = getClient();
    if (!client) return [];
    const { data, error } = await client
      .from('provider_upgrade_requests')
      .select('id, user_id, plan, amount, payment_ref, notes, status, created_at')
      .order('created_at', { ascending: false });
    if (error) { console.error('Upgrades load error', error); return []; }
    return data || [];
  }

  async function emailFor(req) {
    const client = getClient();
    try {
      // auth.admin is server-only; fetch the applicant's profile row.
      const { data } = await client.from('profiles').select('email, full_name').eq('user_id', req.user_id).maybeSingle();
      return data || {};
    } catch (e) { return {}; }
  }

  window.renderAdminUpgrades = async function () {
    const tbody = document.querySelector('#adminUpgradesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const reqs = await loadRequests();
    if (!reqs.length) {
      tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state" style="padding:24px;text-align:center;color:#a99c7e">No upgrade requests yet.</div></td></tr>';
      return;
    }
    for (const r of reqs) {
      const info = await emailFor(r);
      const plan = esc(r.plan || '-');
      const amount = 'R' + esc(r.amount == null ? '' : r.amount);
      const email = esc(info.email || '-');
      const name = esc(info.full_name || '-');
      const ref = esc(r.payment_ref || '-');
      const notes = esc(r.notes || '-');
      const when = esc((r.created_at ? new Date(r.created_at).toLocaleString() : '-'));
      const status = esc(r.status || 'pending');

      let badge =
        status === 'approved' ? '<span style="color:#16a34a;font-weight:700;text-transform:uppercase;font-size:.7rem">Approved</span>' :
        status === 'rejected' ? '<span style="color:#dc2626;font-weight:700;text-transform:uppercase;font-size:.7rem">Rejected</span>' :
        '<span style="color:#d4a853;font-weight:700;text-transform:uppercase;font-size:.7rem">Pending</span>';

      let actions = '';
      if (status === 'pending') {
        actions =
          '<div class="admin-actions">' +
          '<button class="btn btn-primary btn-xs" onclick="approveUpgrade(\'' + r.id + '\')"><i class="fas fa-check"></i> Approve</button>' +
          '<button class="btn btn-secondary btn-xs" style="background:#ef4444;color:#fff" onclick="rejectUpgrade(\'' + r.id + '\')"><i class="fas fa-times"></i> Reject</button>' +
          '</div>';
      } else {
        actions = '<span style="color:#a99c7e;font-size:.75rem">—</span>';
      }

      tbody.innerHTML +=
        '<tr>' +
        '<td>' + name + '</td>' +
        '<td>' + email + '</td>' +
        '<td>' + plan + '</td>' +
        '<td>' + amount + '</td>' +
        '<td class="truncate">' + ref + '</td>' +
        '<td class="truncate">' + notes + '</td>' +
        '<td>' + when + '</td>' +
        '<td>' + badge + '</td>' +
        '<td>' + actions + '</td>' +
        '</tr>';
    }
  };

  window.approveUpgrade = async function (id) {
    if (!confirm('Approve this provider payment? The applicant will still need identity verification before gaining provider access.')) return;
    const client = getClient();
    const request = (await loadRequests()).find(function (r) { return r.id === id; });
    if (!request) { alert('Request not found.'); return; }

    // 1) mark request approved
    const { error: e1 } = await client
      .from('provider_upgrade_requests')
      .update({ status: 'approved', decided_at: new Date().toISOString() })
      .eq('id', id);
    if (e1) { console.error(e1); alert('Could not approve request: ' + e1.message); return; }

    // 2) Provider access is granted once identity verification is also approved
    //    (see the "Provider Applications" / identity page). This page only
    //    confirms the payment. No role change here.
    alert('Payment approved. Provider access is granted once the applicant\u2019s identity verification is also approved.');
    window.renderAdminUpgrades();
  };

  window.rejectUpgrade = async function (id) {
    if (!confirm('Reject this provider upgrade request?')) return;
    const client = getClient();
    const { error } = await client
      .from('provider_upgrade_requests')
      .update({ status: 'rejected', decided_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { console.error(error); alert('Could not reject request: ' + error.message); return; }
    window.renderAdminUpgrades();
  };

  document.addEventListener('DOMContentLoaded', function () {});

  // If the dashboard is already showing and this is the active page, render.
  (function bootstrap() {
    function shouldRender() {
      var pg = document.getElementById('page-admin-upgrades');
      return pg && pg.classList.contains('active');
    }
    if (shouldRender()) { window.renderAdminUpgrades(); }
  })();
})();
