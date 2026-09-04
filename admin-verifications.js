// ==========================================
// 2k2 - Admin: Provider Applications
// Combined review of Service Provider
// applications: payment + identity verification
// (3 photos) grouped under one request.
// Approve / Reject with an optional side note.
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

  function getVerifications() {
    try { return (window.Storage.getProviderVerifications && window.Storage.getProviderVerifications()) || []; }
    catch (e) { return []; }
  }
  function setVerifications(a) {
    try { if (window.Storage && window.Storage.setProviderVerifications) window.Storage.setProviderVerifications(a); } catch (e) {}
  }

  async function loadPayments() {
    const client = getClient();
    if (!client) return [];
    const { data, error } = await client
      .from('provider_upgrade_requests')
      .select('id, user_id, plan, amount, payment_ref, notes, status, created_at')
      .order('created_at', { ascending: false });
    if (error) { console.error('Verifications: payments load error', error); return []; }
    return data || [];
  }

  function badge(status, kind) {
    const c = status === 'approved' ? '#16a34a' : status === 'rejected' ? '#dc2626' : '#d4a853';
    return '<span style="color:' + c + ';font-weight:700;text-transform:uppercase;font-size:.7rem">' + esc(status || 'pending') + '</span>';
  }

  // --- Modal (created once) ---
  let modalEl = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'admin-view-modal';
    modalEl.id = 'verifyReviewModal';
    modalEl.innerHTML =
      '<div class="admin-view-content" style="max-width:720px">' +
      '<div class="admin-modal-header" style="display:flex;justify-content:space-between;align-items:center">' +
      '  <h3 style="margin:0"><i class="fas fa-user-shield"></i> Review Provider Application</h3>' +
      '  <button class="btn btn-secondary btn-xs" onclick="closeVerifyModal()"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div id="verifyModalBody"></div>' +
      '</div>';
    document.body.appendChild(modalEl);
    return modalEl;
  }
  window.closeVerifyModal = function () { if (modalEl) modalEl.classList.remove('active'); };

  function openReview(v, pay) {
    const modal = ensureModal();
    const email = esc(v.email || '-');
    const name = esc(v.displayName || '-');
    const sub = esc(v.submitted_at ? new Date(v.submitted_at).toLocaleString() : '-');
    const plan = pay ? esc(pay.plan || '-') : '—';
    const amount = pay ? 'R' + esc(pay.amount == null ? '' : pay.amount) : '—';
    const pref = pay ? esc(pay.payment_ref || '-') : '—';
    const pstatus = pay ? pay.status : 'no-payment';

    const photoBlock = function (title, dataUrl) {
      if (!dataUrl) {
        return '<div style="margin:6px 0"><b style="font-size:.85rem">' + title + '</b><div style="color:#a99c7e;font-size:.8rem;border:1px dashed #d8cfb6;border-radius:10px;padding:16px;text-align:center;margin-top:6px">No photo</div></div>';
      }
      const key = dataUrl;
      return '<div style="margin:6px 0">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '  <b style="font-size:.85rem">' + title + '</b>' +
        '  <a class="btn btn-secondary btn-xs" href="' + key + '" download="' + title.replace(/[^a-z0-9]+/gi, '_') + '.jpg" style="text-decoration:none"><i class="fas fa-download"></i> Download</a>' +
        '</div>' +
        '<div style="margin-top:6px;border:1px solid #e6dec8;border-radius:10px;overflow:hidden;background:#fff"><img src="' + key + '" alt="" style="width:100%;display:block;max-height:260px;object-fit:contain"></div>' +
        '</div>';
    };

    document.getElementById('verifyModalBody').innerHTML =
      '<div class="admin-view-row"><span class="label">Applicant</span><span class="value">' + name + ' (' + email + ')</span></div>' +
      '<div class="admin-view-row"><span class="label">Submitted</span><span class="value">' + sub + '</span></div>' +
      '<div class="admin-view-row"><span class="label">Identity Status</span><span class="value">' + badge(v.status, 'id') + '</span></div>' +
      '<div class="admin-view-row"><span class="label">Payment</span><span class="value">' + plan + ' · ' + amount + ' · ' + badge(pstatus, 'pay') + '</span></div>' +
      '<div class="admin-view-row"><span class="label">Payment Ref</span><span class="value">' + pref + '</span></div>' +
      '<div style="margin:16px 0 8px;font-weight:800;font-size:.9rem;color:#54492f;border-bottom:1px solid #e6dec8;padding-bottom:6px">Identity Photos</div>' +
      photoBlock('1. ID held next to face', v.idFacePhoto) +
      photoBlock('2. Clean facial photo', v.facePhoto) +
      photoBlock('3. Full body holding ID', v.fullBodyPhoto) +
      (v.adminNote ? '<div style="margin:12px 0;background:#fdf2f2;border:1px solid #f5c6c6;border-radius:10px;padding:10px;font-size:.85rem;color:#a12727"><b>Last note:</b> ' + esc(v.adminNote) + '</div>' : '') +
      '<div style="margin:18px 0 8px"><label class="admin-form-label" for="verifyNote">Side note (shown to the applicant — required when rejecting)</label>' +
      '<textarea id="verifyNote" class="admin-form-input" rows="3" placeholder="e.g. The ID in your photos is blurry. Please retake in good lighting and resubmit."></textarea></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px">' +
      '<button class="btn btn-secondary" onclick="closeVerifyModal()"><i class="fas fa-times"></i> Cancel</button>' +
      '<button class="btn" style="background:#ef4444;color:#fff" onclick="rejectVerification(\'' + v.id + '\')"><i class="fas fa-times"></i> Reject</button>' +
      '<button class="btn btn-primary" onclick="approveVerification(\'' + v.id + '\')"><i class="fas fa-check"></i> Approve</button>' +
      '</div>';

    modal.classList.add('active');
  }

  window.renderAdminVerifications = async function () {
    const tbody = document.querySelector('#adminVerificationsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const vrs = getVerifications();
    const pays = await loadPayments();
    if (!vrs.length) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state" style="padding:24px;text-align:center;color:#a99c7e">No provider applications yet.</div></td></tr>';
      return;
    }
    for (const v of vrs) {
      const pay = pays.find(function (p) { return String(p.user_id) === String(v.user_id); }) || null;
      const name = esc(v.displayName || '-');
      const email = esc(v.email || '-');
      const sub = esc(v.submitted_at ? new Date(v.submitted_at).toLocaleDateString() : '-');
      const pstatus = pay ? pay.status : (v.paymentSubmitted ? 'pending' : 'none');
      const plan = pay ? esc((pay.plan || '') + ' · R' + (pay.amount == null ? '' : pay.amount)) : '—';

      const overall =
        v.status === 'approved' && (pstatus === 'approved') ? '<span class="tag" style="color:#16a34a;font-weight:700;text-transform:uppercase;font-size:.7rem">Accepted</span>' :
        v.status === 'rejected' || pstatus === 'rejected' ? '<span class="tag" style="color:#dc2626;font-weight:700;text-transform:uppercase;font-size:.7rem">Rejected</span>' :
        '<span class="tag" style="color:#d4a853;font-weight:700;text-transform:uppercase;font-size:.7rem">Pending</span>';

      tbody.innerHTML +=
        '<tr>' +
        '<td>' + name + '</td>' +
        '<td>' + email + '</td>' +
        '<td>' + plan + '</td>' +
        '<td>Id: ' + badge(v.status) + '<br>Pay: ' + badge(pstatus) + '</td>' +
        '<td>' + sub + '</td>' +
        '<td>' + overall + '</td>' +
        '<td><div class="admin-actions">' +
        '<button class="btn btn-secondary btn-xs" onclick="openVerifyReview(\'' + v.id + '\')"><i class="fas fa-eye"></i> Review</button>' +
        '</div></td>' +
        '</tr>';
    }
  };

  window.openVerifyReview = function (id) {
    const v = getVerifications().find(function (x) { return x.id === id; });
    if (!v) { alert('Verification not found.'); return; }
    loadPayments().then(function (pays) {
      const pay = pays.find(function (p) { return String(p.user_id) === String(v.user_id); }) || null;
      openReview(v, pay);
    });
  };

  async function setProfileProvider(userId) {
    const client = getClient();
    if (!client) return;
    let target = null;
    try {
      const res = await client.from('profiles').select('role').eq('user_id', userId).maybeSingle();
      target = res.data;
    } catch (e) { return 'error'; }
    if (target && target.role === 'admin') return 'admin-guard';
    try {
      const { error } = await client.from('profiles').update({ role: 'provider', status: 'active', updated_at: new Date().toISOString() }).eq('user_id', userId);
      return error ? 'error' : 'ok';
    } catch (e) { return 'error'; }
  }

  async function loadPendingPayments(userId) {
    const client = getClient();
    if (!client) return [];
    try {
      const { data } = await client.from('provider_upgrade_requests').select('id').eq('user_id', userId).in('status', ['pending']);
      return data || [];
    } catch (e) { return []; }
  }

  window.approveVerification = async function (id) {
    if (!confirm('Approve this application? The applicant will be granted Service Provider access (payment + identity approved).')) return;
    const client = getClient();
    const vrs = getVerifications();
    const v = vrs.find(function (x) { return x.id === id; });
    if (!v) { alert('Verification not found.'); return; }

    // Grant provider role + active status (identity + payment verified).
    const roleRes = await setProfileProvider(v.user_id);
    if (roleRes === 'admin-guard') {
      alert('Approved note: the applicant is an admin account so their role was left unchanged.');
    } else if (roleRes === 'error') {
      alert('Could not update the applicant\u2019s role. Please check the console.');
    }

    // Mark their payment request approved (if any pending).
    if (client) {
      const payRows = await loadPendingPayments(v.user_id);
      for (const p of payRows) {
        try { await client.from('provider_upgrade_requests').update({ status: 'approved', decided_at: new Date().toISOString() }).eq('id', p.id); } catch (e) {}
      }
    }

    // Mark verification approved, purge photos (transient retention done).
    v.status = 'approved';
    v.decided_at = new Date().toISOString();
    v.decided_by = null;
    const note = (document.getElementById('verifyNote') ? document.getElementById('verifyNote').value : '').trim();
    v.adminNote = note || v.adminNote || null;
    delete v.idFacePhoto; delete v.facePhoto; delete v.fullBodyPhoto;
    setVerifications(vrs.map(function (x) { return x.id === v.id ? v : x; }));

    localStorage.setItem('k2_verify_pending', '0');
    closeVerifyModal();
    window.renderAdminVerifications();
    alert('Application approved. The applicant is now a Service Provider.');
  };

  window.rejectVerification = async function (id) {
    const note = (document.getElementById('verifyNote') ? document.getElementById('verifyNote').value : '').trim();
    if (!note) { alert('Please write a side note explaining why this application was rejected — it\u2019s shown to the applicant.'); return; }
    if (!confirm('Reject this application? The applicant will see your note and can resubmit.')) return;
    const client = getClient();
    const vrs = getVerifications();
    const v = vrs.find(function (x) { return x.id === id; });
    if (!v) { alert('Verification not found.'); return; }

    // Reject matching pending payment request.
    if (client) {
      const payRows = await loadPendingPayments(v.user_id);
      for (const p of payRows) {
        try { await client.from('provider_upgrade_requests').update({ status: 'rejected', decided_at: new Date().toISOString() }).eq('id', p.id); } catch (e) {}
      }
    }

    v.status = 'rejected';
    v.decided_at = new Date().toISOString();
    v.adminNote = note;
    delete v.idFacePhoto; delete v.facePhoto; delete v.fullBodyPhoto;
    setVerifications(vrs.map(function (x) { return x.id === v.id ? v : x; }));

    closeVerifyModal();
    window.renderAdminVerifications();
    alert('Application rejected. The applicant has been notified with your note.');
  };

  // If this page is the active dashboard page on load, render.
  (function bootstrap() {
    function check() {
      var pg = document.getElementById('page-admin-verifications');
      if (pg && pg.classList.contains('active')) window.renderAdminVerifications();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check);
    else check();
  })();
})();
