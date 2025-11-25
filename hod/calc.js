function taxNewRegime2025(income) {
    let tax = 0;
    let slabs = [
        [0, 400000, 0],
        [400000, 800000, 0.05],
        [800000, 1200000, 0.10],
        [1200000, 1600000, 0.15],
        [1600000, 2000000, 0.20],
        [2000000, Infinity, 0.30]
    ];
    for (let s of slabs) {
        const [low, high, rate] = s;
        if (income > low) {
            const taxable = Math.min(income, high) - low;
            tax += taxable * rate;
        }
    }
    return tax;
}

function calc() {
    const currentCTC = Number(document.getElementById("ctc").value || 0);
    const hikePct    = Number(document.getElementById("hike").value || 0);

    if (!currentCTC) {
        document.getElementById("result").innerHTML = "<b>Enter a valid Current CTC.</b>";
        return;
    }

    const newCTC = currentCTC * (1 + hikePct / 100);
    const gainAnnual  = newCTC - currentCTC;
    const gainMonthly = gainAnnual / 12;

    // Basic = 40 percent of CTC
    const basic = newCTC * 0.40;

    // PF contributions
    const pfEmployeeAnnual = basic * 0.12;  
    const pfEmployerAnnual = basic * 0.12;
    const pfTotal = pfEmployeeAnnual + pfEmployerAnnual;

    // Taxation: employer PF excluded from taxable salary
    const tax = taxNewRegime2025(newCTC - pfEmployerAnnual);

    const takeHomeAnnual =
        newCTC - tax - pfEmployeeAnnual;

    const takeHomeMonthly = takeHomeAnnual / 12;

    // Monthly expenses
    const rent        = Number(document.getElementById("rent").value || 0);
    const food        = Number(document.getElementById("food").value || 0);
    const air         = Number(document.getElementById("air").value || 0);
    const commute     = Number(document.getElementById("commute").value || 0);
    const electricity = Number(document.getElementById("electricity").value || 0);
    const internet    = Number(document.getElementById("internet").value || 0);
    const emi         = Number(document.getElementById("emi").value || 0);

    const expenses = rent + food + air + commute + electricity + internet + emi;
    const savings  = takeHomeMonthly - expenses;

    document.getElementById("result").innerHTML = `
        <h3>Results</h3>
        <b>Current CTC:</b> ₹${currentCTC.toLocaleString()} <br>
        <b>New CTC:</b> ₹${newCTC.toLocaleString()} <br><br>

        <b>Annual Gain:</b> ₹${gainAnnual.toLocaleString()} <br>
        <b>Monthly Gain:</b> ₹${gainMonthly.toLocaleString()} <br><br>

        <b>Basic (40 percent):</b> ₹${basic.toLocaleString()} <br>
        <b>PF Employee (12 percent):</b> ₹${pfEmployeeAnnual.toLocaleString()} <br>
        <b>PF Employer (12 percent):</b> ₹${pfEmployerAnnual.toLocaleString()} <br>
        <b>Total PF (24 percent):</b> ₹${pfTotal.toLocaleString()} <br><br>

        <b>Income Tax (Annual):</b> ₹${tax.toLocaleString()} <br>
        <b>Take-Home (Annual):</b> ₹${takeHomeAnnual.toLocaleString()} <br>
        <b>Take-Home (Monthly):</b> ₹${takeHomeMonthly.toLocaleString()} <br><br>

        <b>Total Monthly Expenses:</b> ₹${expenses.toLocaleString()} <br>
        <b>Monthly Savings:</b>
        <span style="color:${savings >= 0 ? "green" : "red"}">
            ₹${savings.toLocaleString()}
        </span>
    `;
}