
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  getLeaves,
  approveLeave,
  rejectLeave,
} from '../../services/leaveService';

export default function AllLeaveRequests() {
  const [i, setI] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const load = async () => {
    try {
      const r = await getLeaves();
      setI(r.data?.content || r.data || []);
    } catch (e) {
      setI([]);
      alert('Could not load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (leaveId, decision) => {
    const action = decision === 'APPROVED' ? 'approve' : 'reject';

    if (
      !window.confirm(
        `Are you sure you want to ${action} this leave request?`
      )
    ) {
      return;
    }

    let comment = '';

    if (decision === 'REJECTED') {
      comment = window.prompt(
        'Enter a reason for rejection (optional):'
      );

      if (comment === null) {
        return;
      }
    }

    setProcessing(leaveId);

    try {
      if (decision === 'APPROVED') {
        await approveLeave(leaveId);
      } else {
        await rejectLeave(leaveId, comment);
      }

      alert(`Leave request ${action}ed successfully.`);
      await load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
          e.response?.data?.error ||
          `Unable to ${action} the request. Please check the backend.`
      );
    } finally {
      setProcessing(null);
    }
  };

  const f = i.filter((x) => {
    const n = x.user?.name || x.employeeName || '';

    return (
      (!status || String(x.status).toUpperCase() === status) &&
      n.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Layout title="All Leave Requests">
      <div className="page-header">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h2>All leave requests</h2>
        </div>
      </div>

      <section className="panel">
        <div className="filters">
          <input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : f.length === 0 ? (
          <div className="empty-state">No requests found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Reviewed By</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {f.map((x) => (
                  <tr key={x.id}>
                    <td>
                      {x.user?.name || x.employeeName || 'Employee'}
                    </td>

                    <td>
                      {x.leaveType?.name ||
                        x.leaveTypeName ||
                        x.leaveType ||
                        'Leave'}
                    </td>

                    <td>
                      {x.startDate || x.start_date} →{' '}
                      {x.endDate || x.end_date}
                    </td>

                    <td>{x.totalDays || x.total_days || 0}</td>

                    <td>
                      <StatusBadge status={x.status} />
                    </td>

                    <td>
                      {x.reviewedBy?.name || x.reviewerName || '—'}
                    </td>

                    <td>
                      {String(x.status).toUpperCase() === 'PENDING' ? (
                        <div className="action-row">
                          <button
                            type="button"
                            className="small"
                            disabled={processing === x.id}
                            onClick={() =>
                              handleDecision(x.id, 'APPROVED')
                            }
                          >
                            {processing === x.id
                              ? 'Processing...'
                              : 'Approve'}
                          </button>

                          <button
                            type="button"
                            className="small danger"
                            disabled={processing === x.id}
                            onClick={() =>
                              handleDecision(x.id, 'REJECTED')
                            }
                          >
                            {processing === x.id
                              ? 'Processing...'
                              : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
