// Replace with your Google Apps Script Web App URL
const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Dark Mode Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const htmlClass = document.documentElement.classList;

themeToggle.addEventListener('click', () => {
  if (htmlClass.contains('light')) {
    htmlClass.remove('light');
    htmlClass.add('dark');
  } else {
    htmlClass.remove('dark');
    htmlClass.add('light');
  }
});

// Form Submission Logic
document.getElementById('resultForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const regNo = document.getElementById('regNo').value.trim();
  const loader = document.getElementById('loader');
  const resultBox = document.getElementById('resultBox');
  const marksContainer = document.getElementById('marksContainer');
  
  // Reset UI
  resultBox.classList.add('hidden');
  loader.classList.remove('hidden');
  marksContainer.innerHTML = '';

  try {
    const response = await fetch(`${API_URL}?regNo=${regNo}`);
    const resData = await response.json();

    if (resData.status === "success") {
      const data = resData.data;
      
      // Map basic info (Adjust keys based on your exact Sheet headers)
      document.getElementById('studentName').textContent = data['Name'] || "Student";
      document.getElementById('displayReg').textContent = data['RegNo'] || regNo;
      document.getElementById('totalMarks').textContent = data['Total'] || "-";
      document.getElementById('finalGrade').textContent = data['Rank'] || data['Grade'] || "-";

      // Dynamically map subjects
      const ignoreKeys = ['RegNo', 'Name', 'Total', 'Rank', 'Grade', 'Attendance'];
      for (const [key, value] of Object.entries(data)) {
        if (!ignoreKeys.includes(key)) {
          marksContainer.innerHTML += `
            <div class="flex justify-between items-center text-sm">
              <span class="font-medium text-gray-600 dark:text-gray-300">${key}</span>
              <span class="font-bold">${value}</span>
            </div>
          `;
        }
      }

      loader.classList.add('hidden');
      resultBox.classList.remove('hidden');
    } else {
      alert("Result not found for this Registration Number.");
      loader.classList.add('hidden');
    }
  } catch (error) {
    alert("Network error. Please try again.");
    loader.classList.add('hidden');
  }
});