
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import {
  createLeaveType,
  deleteLeaveType,
  getLeaveTypes,
  updateLeaveType,
} from '../../services/employeeService';
 function LeaveTypeManagement() {
  const [i, setI] = useState([]);
  const [f, setF] = useState({
    name: '',
    description: '',
    maxDays: 10,
  });
  const [edit, setEdit] = useState(null);

  const load = () =>
    getLeaveTypes()
      .then((r) => setI(r.data?.content || r.data || []))
      .catch(() => setI([]));

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    try {
      if (edit) {
        await updateLeaveType(edit, f);
      } else {
        await createLeaveType(f);
      }

      setF({ name: '', description: '', maxDays: 10 });
      setEdit(null);
      load();
    } catch (x) {
      alert(x.message);
    }
  };

  return (
    <Layout title="Leave Types">
      <div className="page-header">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h2>Leave types</h2>
        </div>
      </div>

      <section className="panel form-panel compact">
        <form onSubmit={save}>
          <div className="form-grid">
            <label>
              Name
              <input
                value={f.name}
                onChange={(e) =>
                  setF({ ...f, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Maximum Days
              <input
                type="number"
                min="1"
                value={f.maxDays}
                onChange={(e) =>
                  setF({ ...f, maxDays: Number(e.target.value) })
                }
              />
            </label>

            <label className="full-width">
              Description
              <input
                value={f.description}
                onChange={(e) =>
                  setF({ ...f, description: e.target.value })
                }
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setEdit(null);
                setF({ name: '', description: '', maxDays: 10 });
              }}
            >
              Clear
            </button>

            <button className="primary-button">
              {edit ? 'Update' : 'Add Leave Type'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Max Days</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {i.map((x) => (
                <tr key={x.id}>
                  <td>{x.name}</td>
                  <td>{x.description || '—'}</td>
                  <td>{x.maxDays || x.max_days || '—'}</td>

                  <td>
                    <div className="action-row">
                      <button
                        className="small"
                        onClick={() => {
                          setEdit(x.id);
                          setF({
                            name: x.name || '',
                            description: x.description || '',
                            maxDays:
                              x.maxDays || x.max_days || 10,
                          });
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="small danger"
                        onClick={async () => {
                          if (!confirm('Delete leave type?')) return;

                          try {
                            await deleteLeaveType(x.id);
                            load();
                          } catch (e) {
                            alert(e.message);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
export default LeaveTypeManagement;