// Helper: format number as currency ($)
function fmt(value){
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

const incomeEl = document.getElementById('income');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const expensesEl = document.getElementById('expenses');
const levelEl = document.getElementById('level');

const hourlyEl = document.getElementById('hourly');
const dailyEl = document.getElementById('daily');
const monthlyEl = document.getElementById('monthly');
const explanationEl = document.getElementById('explanation');

document.getElementById('calculate').addEventListener('click', calculateRate);
document.getElementById('reset').addEventListener('click', resetForm);

// Allow pressing Enter in any field to calculate
Array.from([incomeEl, daysEl, hoursEl, expensesEl, levelEl]).forEach(el => {
  el.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') calculateRate();
  });
});

function calculateRate(){
  // read inputs and parse
  const monthlyGoal = Number(incomeEl.value) || 0;
  const workingDays = Number(daysEl.value) || 0;
  const hoursPerDay = Number(hoursEl.value) || 0;
  const monthlyExpenses = Number(expensesEl.value) || 0;
  const multiplier = Number(levelEl.value) || 1;

  // Basic validation
  if(monthlyGoal <= 0 || workingDays <= 0 || hoursPerDay <= 0){
    explanationEl.textContent = "Please enter positive values for monthly goal, working days, and hours per day.";
    hourlyEl.textContent = fmt(0) + " / hour";
    dailyEl.textContent = fmt(0);
    monthlyEl.textContent = fmt(0);
    return;
  }

  // Step-by-step math (clear and explicit)
  const annualGoal = monthlyGoal * 12;               // target yearly income
  const annualExpenses = monthlyExpenses * 12;       // yearly expenses
  const annualHours = workingDays * hoursPerDay * 12; // total billable hours per year

  // base hourly rate before experience multiplier
  const baseHourly = (annualGoal + annualExpenses) / annualHours;

  // apply experience multiplier to get recommended hourly
  const recommendedHourly = baseHourly * multiplier;

  // derived figures
  const daily = recommendedHourly * hoursPerDay;
  const expectedMonthly = daily * workingDays;

  // display nicely
  hourlyEl.textContent = fmt(recommendedHourly) + " / hour";
  dailyEl.textContent = fmt(daily);
  monthlyEl.textContent = fmt(expectedMonthly);

  // explanation text
  explanationEl.innerHTML = 
    `Calculation: annual goal $${Math.round(annualGoal).toLocaleString()} + annual expenses $${Math.round(annualExpenses).toLocaleString()} = total $${Math.round(annualGoal + annualExpenses).toLocaleString()}. ` +
    `Dividing by estimated billable hours (${Math.round(annualHours).toLocaleString()}) gives a base hourly of ${fmt(baseHourly)}. ` +
    `Applying your experience multiplier (${multiplier}) results in a recommended rate of ${fmt(recommendedHourly)} per hour. ` +
    `At this rate you'd earn about ${fmt(expectedMonthly)} / month (based on ${workingDays} days × ${hoursPerDay} hrs/day).`;
}

function resetForm(){
  incomeEl.value = '';
  daysEl.value = '';
  hoursEl.value = '';
  expensesEl.value = '';
  levelEl.value = '1.2';
  hourlyEl.textContent = fmt(0) + " / hour";
  dailyEl.textContent = fmt(0);
  monthlyEl.textContent = fmt(0);
  explanationEl.textContent = 'Enter your details and click Calculate to see results and a short explanation.';
}
