HI
// Replace with your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbyE1IBZATDTqT_K5k9f51Fezyqbxtft5UTrL0teUuPYElQ0LW_-kWiavJAD2PXJ5zBlFQ/exec";

// Replace with your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbyE1IBZATDTqT_K5k9f51Fezyqbxtft5UTrL0teUuPYElQ0LW_-kWiavJAD2PXJ5zBlFQ/exec";

// Dark Mode Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const htmlClass = document.documentElement.classList;

themeToggle.addEventListener('click', () => {
  htmlClass.toggle('dark');
});

// Form Submission Logic
document.getElementById('resultForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const regNo = document.getElementById('regNo').value.trim();
  const loader = document.getElementById('loader');
  const printableResult = document.getElementById('printableResult');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const marksContainer = document.getElementById('marksContainer');
  const resultForm = document.getElementById('resultForm');
  
  // Reset UI
  printableResult.classList.add('hidden');
  downloadPdfBtn.classList.add('hidden');
  resultForm.classList.add('hidden'); // Hide form when fetching
  loader.classList.remove('hidden');
  marksContainer.innerHTML = '';

  try {
    const response = await fetch(`${API_URL}?regNo=${regNo}`);
    const resData = await response.json();

    if (resData.status === "success") {
      const data = resData.data;
      
      // Map basic info matching the new Template Headers
      document.getElementById('studentName').textContent = data['Name'] || "Student";
      document.getElementById('displayReg').textContent = data['RegNo'] || regNo;
      document.getElementById('displayGrade').textContent = data['Grade'] || "-";
      document.getElementById('displayAttendance').textContent = (data['Attendance'] * 100).toFixed(0) + "%" || "-";
      document.getElementById('totalMarks').textContent = data['Total'] || "-";
      document.getElementById('finalRank').textContent = data['Rank'] || "-";

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
      printableResult.classList.remove('hidden');
      downloadPdfBtn.classList.remove('hidden');
      
      // Notify Success with SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Result Found!',
        text: `Records loaded for ${data['Name']}`,
        timer: 1500,
        showConfirmButton: false
      });

    } else {
      loader.classList.add('hidden');
      resultForm.classList.remove('hidden'); // Bring form back
      
      // Error with SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Not Found',
        text: 'No result found for this Registration Number.',
        confirmButtonColor: '#2563eb'
      });
    }
  } catch (error) {
    loader.classList.add('hidden');
    resultForm.classList.remove('hidden');
    
    Swal.fire({
      icon: 'error',
      title: 'Network Error',
      text: 'Could not connect to the database. Please try again later.',
      confirmButtonColor: '#2563eb'
    });
  }
});

// PDF Download Logic
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
  const element = document.getElementById('printableResult');
  const studentName = document.getElementById('studentName').textContent;
  
  // Briefly style for PDF output (force light mode for printer)
  const isDark = htmlClass.contains('dark');
  if (isDark) htmlClass.remove('dark');

  const opt = {
    margin:       10,
    filename:     `${studentName}_Result.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    // Restore dark mode if it was active
    if (isDark) htmlClass.add('dark');
    
    Swal.fire({
      icon: 'success',
      title: 'Downloaded!',
      text: 'Your result PDF has been saved.',
      timer: 1500,
      showConfirmButton: false
    });
  });
});
