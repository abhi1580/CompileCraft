import React from 'react';
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const invoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: 50000, status: 'Paid', date: '2024-06-01' },
  { id: 'INV-002', client: 'Beta Ltd', amount: 75000, status: 'Unpaid', date: '2024-06-10' },
  { id: 'INV-003', client: 'Gamma Inc', amount: 120000, status: 'Paid', date: '2024-06-15' },
  { id: 'INV-004', client: 'Delta LLC', amount: 30000, status: 'Unpaid', date: '2024-06-20' },
];

function Revenue() {
  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  return (
    <section className="revenue_area py-5" style={{ background: '#f8f9fb', minHeight: '80vh' }}>
      <div className="container">
        <div className="mb-4">
          <h2 style={{ fontWeight: 800 }}>Revenue</h2>
        </div>
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="bg-white rounded-4 shadow-sm p-4 text-center">
              <FaMoneyBillWave size={32} color="#F94F4F" className="mb-2" />
              <h4 className="fw-bold mb-0">₹{total.toLocaleString()}</h4>
              <div className="text-muted">Total Invoiced</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white rounded-4 shadow-sm p-4 text-center">
              <FaCheckCircle size={32} color="#28a745" className="mb-2" />
              <h4 className="fw-bold mb-0">₹{paid.toLocaleString()}</h4>
              <div className="text-muted">Paid</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white rounded-4 shadow-sm p-4 text-center">
              <FaTimesCircle size={32} color="#dc3545" className="mb-2" />
              <h4 className="fw-bold mb-0">₹{(total - paid).toLocaleString()}</h4>
              <div className="text-muted">Unpaid</div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered bg-white rounded-4 shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={idx}>
                  <td>{inv.id}</td>
                  <td>{inv.client}</td>
                  <td>₹{inv.amount.toLocaleString()}</td>
                  <td>
                    {inv.status === 'Paid' ? (
                      <span className="text-success"><FaCheckCircle className="me-1" />Paid</span>
                    ) : (
                      <span className="text-danger"><FaTimesCircle className="me-1" />Unpaid</span>
                    )}
                  </td>
                  <td>{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Revenue; 