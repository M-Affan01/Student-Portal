// Load Fees and Display Challan
async function loadFees() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        console.log("[FEE_SYSTEM] Fetching fresh fee data...");
        const res = await fetch(`${API_URL}/student/fees?_t=${Date.now()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const fees = await res.json();
        console.log(`[FEE_SYSTEM] Received ${fees.length} records.`);

        // Separate and calculate
        const pendingFees = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
        const paidFees = fees.filter(f => f.status === 'Paid');

        const totalPendingAmount = pendingFees.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

        console.log(`[FEE_SYSTEM] Pending: ${pendingFees.length} ($${totalPendingAmount.toFixed(2)}), Paid: ${paidFees.length}`);

        // Update Dashboard Stats (if elements exist on page)
        const totalCoursesEl = document.getElementById('total-courses');
        if (totalCoursesEl) totalCoursesEl.innerText = fees.length.toString();

        const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student', rollNumber: 'CS-XXXX-XXX' };

        const nameEl = document.getElementById('challan-student-name');
        const rollEl = document.getElementById('challan-roll-no');
        if (nameEl) nameEl.textContent = user.name;
        if (rollEl) rollEl.textContent = user.rollNumber;

        // --- 1. PORTION: Pending Invoices (Challan Table) ---
        const tbody = document.getElementById('fee-breakdown-list-table');
        const totalEl = document.getElementById('breakdown-total-table');
        const statusBadge = document.getElementById('challan-status-badge');
        const dueDateEl = document.getElementById('challan-due-date');

        if (tbody) {
            tbody.innerHTML = '';
            if (pendingFees.length > 0) {
                pendingFees.forEach(f => {
                    const tr = document.createElement('tr');
                    tr.className = "border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors";
                    tr.innerHTML = `
                        <td class="px-4 py-4">
                            <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">${f.description}</div>
                            <div class="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1">Status: ${f.status}</div>
                        </td>
                        <td class="px-4 py-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                            $${parseFloat(f.amount).toFixed(2)}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                if (totalEl) {
                    totalEl.className = "px-4 py-3 text-right text-indigo-600 dark:text-indigo-400 text-lg font-bold";
                    totalEl.innerText = `$${totalPendingAmount.toFixed(2)}`;
                }

                if (statusBadge) {
                    statusBadge.innerText = "UNPAID";
                    statusBadge.className = "px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200";
                }
                if (dueDateEl) {
                    dueDateEl.innerText = pendingFees[0].due_date ? new Date(pendingFees[0].due_date).toLocaleDateString() : 'Immediate';
                    dueDateEl.className = "font-bold text-red-600 text-lg";
                }
            } else {
                tbody.innerHTML = `<tr><td colspan="2" class="py-12 text-center text-gray-400 italic">No remaining dues. All courses for this semester are cleared.</td></tr>`;
                if (totalEl) {
                    totalEl.innerText = "PAID";
                    totalEl.className = "px-4 py-3 text-right text-green-500 text-lg font-bold";
                }
                if (statusBadge) {
                    statusBadge.innerText = "CLEAR";
                    statusBadge.className = "px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200";
                }
                if (dueDateEl) {
                    dueDateEl.innerText = "N/A";
                    dueDateEl.className = "font-bold text-green-600 text-lg";
                }
            }
        }

        // --- 2. PORTION: Action Area (Buttons) ---
        const actionArea = document.getElementById('fee-action-area');
        const totalDisplay = document.getElementById('total-amount');
        if (totalDisplay) totalDisplay.innerText = `$${totalPendingAmount.toFixed(2)}`;

        if (actionArea) {
            if (totalPendingAmount > 0) {
                actionArea.innerHTML = `
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button onclick="downloadChallanPDF()" class="flex-1 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-all flex items-center justify-center">
                            <i class="fa-solid fa-file-pdf mr-2"></i> Download Challan
                        </button>
                        <button onclick="payAllFees()" class="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center">
                            <i class="fa-solid fa-credit-card mr-2"></i> Pay Online Now
                        </button>
                    </div>
                `;
            } else {
                actionArea.innerHTML = `
                    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl p-4 text-center">
                        <p class="text-green-700 dark:text-green-300 font-bold"><i class="fa-solid fa-circle-check mr-2"></i> All Fees Cleared!</p>
                    </div>
                `;
            }
        }

        // --- 3. PORTION: History Records (Paid Items) ---
        const receiptsList = document.getElementById('receipts-list');
        if (receiptsList) {
            receiptsList.innerHTML = '';
            if (paidFees.length > 0) {
                receiptsList.innerHTML = `
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-gray-400 font-bold uppercase border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th class="pb-3 px-2">Transaction</th>
                                    <th class="pb-3 px-2 text-right">Amount</th>
                                    <th class="pb-3 px-2 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-gray-700" id="history-rows"></tbody>
                        </table>
                    </div>`;

                const historyTbody = document.getElementById('history-rows');
                paidFees.forEach((f, idx) => {
                    const payDate = f.payment_date ? new Date(f.payment_date).toLocaleDateString() : 'Paid Recently';
                    const txId = `TXN-${2025000 + f.fee_id}`;

                    const tr = document.createElement('tr');
                    tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors animate__animated animate__fadeInUp";
                    tr.style.animationDelay = `${idx * 0.05}s`;
                    tr.innerHTML = `
                        <td class="py-4 px-2">
                            <div class="font-bold text-gray-800 dark:text-gray-200 text-sm">${f.description}</div>
                            <div class="text-[10px] text-green-600 font-mono tracking-tighter">${payDate} | ${txId}</div>
                        </td>
                        <td class="py-4 px-2 text-right font-bold text-gray-700 dark:text-gray-300">$${parseFloat(f.amount).toFixed(2)}</td>
                        <td class="py-4 px-2 text-right">
                            <button onclick="generateSingleReceipt('${f.description.replace(/'/g, "\\'")}', '${f.amount}', '${payDate}', '${txId}')" 
                                    class="p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">
                                <i class="fa-solid fa-file-invoice-dollar"></i>
                            </button>
                        </td>
                    `;
                    historyTbody.appendChild(tr);
                });
            } else {
                receiptsList.innerHTML = `
                    <div class="text-center py-10 opacity-50">
                        <i class="fa-regular fa-folder-open text-4xl mb-3"></i>
                        <p>No paid invoices found.</p>
                    </div>`;
            }
        }

    } catch (error) {
        console.error("[FEE_SYSTEM] Error rendering fees:", error);
    }
}

// --- Interactive Payment Functions ---

function payAllFees() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('hidden');
        gsap.from("#payment-modal > div > div", { y: -50, opacity: 0, duration: 0.3, ease: "power2.out" });
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.add('hidden');
}

async function processPayment() {
    if (!validatePaymentForm()) return;

    const btn = document.querySelector('#payment-modal button[onclick="processPayment()"]');
    if (!btn) return;

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Processing...';
    btn.disabled = true;

    try {
        const token = checkAuth();
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardEnding = cardNumber.slice(-4);

        const res = await fetch(`${API_URL}/student/pay-fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cardEnding })
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Transaction Successful',
                text: 'Your student account has been updated.',
                timer: 2000,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
            });
            closePaymentModal();
            setTimeout(() => loadFees(), 500); // Small delay to let DB settle
        } else {
            throw new Error(data.message || 'Payment processing failed');
        }
    } catch (error) {
        console.error("[FEE_SYSTEM] Payment error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Payment Error',
            text: error.message
        });
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- Validation Logic ---

function validatePaymentForm() {
    let isValid = true;
    const name = document.getElementById('card-name');
    const number = document.getElementById('card-number');
    const expiry = document.getElementById('card-expiry');
    const cvv = document.getElementById('card-cvv');

    const resetError = (id) => {
        const err = document.getElementById(`error-${id}`);
        err.classList.add('hidden');
        document.getElementById(id).classList.remove('border-red-500');
    };

    const showError = (id, msg) => {
        const err = document.getElementById(`error-${id}`);
        err.textContent = msg;
        err.classList.remove('hidden');
        document.getElementById(id).classList.add('border-red-500');
        isValid = false;
    };

    ['card-name', 'card-number', 'card-expiry', 'card-cvv'].forEach(resetError);

    if (!name.value.trim()) showError('card-name', 'Name is required');

    // Luhn Check for Card Number
    if (!validateLuhn(number.value.replace(/\s/g, ''))) {
        showError('card-number', 'Invalid card number');
    }

    // Expiry Check (MM/YY)
    const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expRegex.test(expiry.value)) {
        showError('card-expiry', 'Use format MM/YY');
    } else {
        const [m, y] = expiry.value.split('/');
        const now = new Date();
        const currentYear = parseInt(now.getFullYear().toString().slice(-2));
        const currentMonth = now.getMonth() + 1;
        if (parseInt(y) < currentYear || (parseInt(y) === currentYear && parseInt(m) < currentMonth)) {
            showError('card-expiry', 'Card has expired');
        }
    }

    if (cvv.value.length < 3) showError('card-cvv', 'Invalid CVV');

    return isValid;
}

function validateLuhn(number) {
    if (!number || number.length < 13) return false;
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
        let intVal = parseInt(number.substr(number.length - 1 - i, 1));
        if (i % 2 !== 0) {
            intVal *= 2;
            if (intVal > 9) intVal -= 9;
        }
        sum += intVal;
    }
    return sum % 10 === 0;
}

// --- Input Masking ---

function initMasking() {
    const cardInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('card-expiry');
    const cvvInput = document.getElementById('card-cvv');

    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
            e.target.value = formatted.substring(0, 19);
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                e.target.value = value;
            }
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

// --- Document Generation ---

function generateSingleReceipt(desc, amount, date, transId) {
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student' };
    const win = window.open('', '', 'width=800,height=700');
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt ${transId}</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 p-10 font-sans">
            <div class="max-w-xl mx-auto bg-white p-10 shadow-xl rounded-2xl border border-gray-100">
                <div class="text-center border-b border-dashed pb-8 mb-8">
                    <h2 class="text-3xl font-extrabold text-indigo-900">NEXOR UNIVERSITY</h2>
                    <p class="text-gray-400 text-sm tracking-widest uppercase mt-1">Official Payment Receipt</p>
                </div>
                <div class="flex justify-between mb-8 text-sm">
                    <div>
                        <p class="text-gray-500 uppercase text-[10px] font-bold">Student Name</p>
                        <p class="font-bold text-gray-800 text-lg">${user.name}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-500 uppercase text-[10px] font-bold">Transaction ID</p>
                        <p class="font-mono font-bold text-indigo-600">${transId}</p>
                    </div>
                </div>
                <div class="bg-indigo-50/50 p-6 rounded-2xl mb-8 border border-indigo-100">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-gray-700 font-medium">${desc}</span>
                        <span class="font-bold text-gray-900">$${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center pt-4 border-t border-indigo-200">
                        <span class="font-extrabold text-gray-800">TOTAL PAID</span>
                        <span class="font-extrabold text-green-600 text-2xl">$${parseFloat(amount).toFixed(2)}</span>
                    </div>
                </div>
                <div class="text-center space-y-2">
                    <div class="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Success</div>
                    <p class="text-[10px] text-gray-400">Paid on ${date}</p>
                    <p class="text-[10px] text-gray-300 mt-4 italic">This is an electronically generated document. No signature is required.</p>
                </div>
            </div>
            <script>setTimeout(()=>window.print(), 800)</script>
        </body>
        </html>
    `);
    win.document.close();
}

function downloadChallanPDF() {
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student', rollNumber: 'CS-XXXX' };
    const challanNo = 'CH-' + Math.floor(100000 + Math.random() * 900000);
    const date = new Date().toLocaleDateString();

    const totalEl = document.getElementById('breakdown-total-table');
    const totalText = totalEl ? totalEl.innerText : '$0.00';

    const win = window.open('', '', 'width=1100,height=800');

    const copyTemplate = (title) => `
        <div class="border-2 border-gray-900 p-5 w-1/3 text-[10px] font-mono relative bg-white">
            <div class="absolute top-2 right-2 text-[8px] font-bold border-2 border-black px-2 py-1">${title}</div>
            <div class="text-center mb-6">
                <h1 class="font-black text-xl tracking-tighter">NEXOR UNIVERSITY</h1>
                <p class="text-[8px] uppercase tracking-widest">Knowledge City Campus, UK</p>
                <div class="mt-2 py-1 bg-black text-white font-bold inline-block px-4">FEE CHALLAN</div>
            </div>
            
            <div class="grid grid-cols-2 gap-2 mb-6 border-b border-black pb-4">
                <div>Challan No: <span class="font-bold">${challanNo}</span></div>
                <div class="text-right">Date: <span>${date}</span></div>
                <div>Due Date: <span class="font-bold underline">Immediate</span></div>
            </div>

            <div class="space-y-1 mb-6 text-xs capitalize">
                <div class="flex"><span class="w-20 font-bold">Student:</span> <span>${user.name}</span></div>
                <div class="flex"><span class="w-20 font-bold">Roll No:</span> <span>${user.rollNumber}</span></div>
                <div class="flex"><span class="w-20 font-bold">Program:</span> <span>BS Computer Science</span></div>
            </div>

            <table class="w-full mb-10">
                <tr class="border-b-2 border-black"><th class="text-left pb-2">Description</th><th class="text-right pb-2">Amount</th></tr>
                <tr><td class="py-2">Semester Fees</td><td class="text-right">${totalText}</td></tr>
                <tr><td class="py-2">Admin Charges</td><td class="text-right">$0.00</td></tr>
                <tr class="font-black border-t-2 border-black text-sm"><td class="pt-2">TOTAL PAYABLE</td><td class="pt-2 text-right">${totalText}</td></tr>
            </table>

            <div class="mt-20 flex justify-between">
                <div class="text-center w-1/2 pt-4 border-t border-black mr-4 uppercase font-bold text-[8px]">Bank Stamp/Sign</div>
                <div class="text-center w-1/2 pt-4 border-t border-black uppercase font-bold text-[8px]">Student Sign</div>
            </div>
            <p class="mt-6 text-[7px] text-center italic border-t pt-2 border-gray-200">Payment accepted at all HBL/UBL/Standard Chartered branches nationwide.</p>
        </div>
    `;

    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bank Challan - ${challanNo}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>@media print { .no-print { display: none; } }</style>
        </head>
        <body class="bg-gray-100 p-8">
            <div class="flex gap-4 max-w-[1200px] mx-auto">
                ${copyTemplate('BANK COPY')}
                ${copyTemplate('UNIVERSITY COPY')}
                ${copyTemplate('STUDENT COPY')}
            </div>
            <div class="text-center mt-12 no-print">
                <button onclick="window.print()" class="px-8 py-3 bg-black text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-transform">
                    <i class="fa-solid fa-print mr-2"></i> Print Challan
                </button>
                <p class="text-gray-400 text-xs mt-4">Tip: Print in Landscape for best results.</p>
            </div>
        </body>
        </html>
    `);
    win.document.close();
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    loadFees();
    initMasking();
});

