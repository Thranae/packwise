import { jsPDF } from 'jspdf';
import { getTripImage } from './imageUtils';

// Helper to avoid canvas tainting by fetching image directly to base64
const fetchImageAsBase64 = async (url) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Failed to fetch image as base64:", e);
    return null; // fallback to gradient
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'TBD';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));
};

export const generatePremiumPDF = async (trip) => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const destName = trip?.destination?.split('&')[0] || 'Unknown Destination';
    
    // Fetch stunning image for the destination cover
    const imageUrl = getTripImage(destName);
    const base64Image = await fetchImageAsBase64(imageUrl);

    // Parse itinerary safely
    let itineraryDays = trip?.itinerary;
    if (!Array.isArray(itineraryDays)) {
      if (trip?.itinerary?.days && Array.isArray(trip.itinerary.days)) {
        itineraryDays = trip.itinerary.days;
      } else {
        itineraryDays = [];
      }
    }

    // Build the HTML DOM template
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '1000px'; 
    // Height is auto so it expands to fit all the text

    const imageHtml = base64Image 
      ? `<img src="${base64Image}" class="absolute inset-0 w-full h-full object-cover" />`
      : `<div class="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900"></div>`;

    container.innerHTML = `
      <div id="pdf-content" class="w-[1000px] bg-slate-50 font-sans flex flex-col min-h-[1414px]">
        <!-- Cover Section -->
        <div class="relative w-full h-[650px] overflow-hidden shrink-0">
           ${imageHtml}
           <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
           <div class="absolute bottom-16 left-16 right-16 flex flex-col text-white">
              <span class="text-2xl font-black tracking-[0.4em] uppercase text-blue-400 mb-4 drop-shadow-md">Voyage Genie Itinerary</span>
              <h1 class="text-[5.5rem] font-black tracking-tighter leading-none capitalize drop-shadow-2xl mb-8">${destName}</h1>
              <div class="flex items-center gap-6">
                 <div class="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                   <span class="text-xl font-bold">${formatDate(trip?.startDate)} - ${formatDate(trip?.endDate)}</span>
                 </div>
                 <div class="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                   <span class="text-xl font-bold">${trip?.travelers || 1} Travelers</span>
                 </div>
                 <div class="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                   <span class="text-xl font-bold">Budget: ${trip?.currency || '$'} ${trip?.budget || 'N/A'}</span>
                 </div>
              </div>
           </div>
        </div>
        
        <!-- Itinerary Content -->
        <div class="p-16 flex flex-col gap-12 bg-slate-50 grow">
           <h2 class="text-[2.75rem] font-black text-slate-800 tracking-tight border-b-4 border-blue-500 pb-4 inline-block w-auto self-start">Your Travel Plan</h2>
           
           <div class="flex flex-col gap-10">
              ${itineraryDays.length > 0 ? itineraryDays.map((day, i) => `
                <div class="flex flex-col bg-white rounded-3xl p-10 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                   <div class="flex items-center gap-5 mb-8">
                      <div class="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                        ${i + 1}
                      </div>
                      <h3 class="text-3xl font-bold text-slate-800 tracking-tight">${day.title || \`Day \${i + 1}\`}</h3>
                   </div>
                   <div class="flex flex-col gap-6 pl-6 border-l-4 border-slate-100 ml-7">
                      ${(Array.isArray(day) ? day : (day.activities || [])).map(act => {
                         const time = act.time || act.startTime || '';
                         const actTitle = act.title || act.name || act.activity || act;
                         const desc = act.description || act.details || '';
                         return \`
                         <div class="flex flex-col gap-1.5 relative">
                           <div class="absolute -left-[31px] top-2 w-3 h-3 rounded-full bg-blue-300 border-[3px] border-white shadow-sm"></div>
                           <span class="font-extrabold text-slate-800 text-xl tracking-tight leading-snug">
                             \${time ? \`<span class="text-blue-500 mr-2">\${time}</span>\` : ''}\${typeof actTitle === 'string' ? actTitle : 'Activity'}
                           </span>
                           \${desc ? \`<span class="text-slate-500 text-[1.1rem] leading-relaxed font-medium max-w-3xl">\${desc}</span>\` : ''}
                         </div>
                         \`
                      }).join('')}
                   </div>
                </div>
              `).join('') : `
                <div class="p-10 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <span class="text-slate-500 text-2xl font-bold tracking-tight">AI is still curating this itinerary.</span>
                </div>
              `}
           </div>
        </div>
        
        <!-- Footer -->
        <div class="w-full bg-[#0f172a] py-12 px-16 flex items-center justify-between text-slate-400 mt-auto shrink-0 border-t border-white/10">
           <span class="text-xl font-black tracking-[0.2em] text-white uppercase">Voyage Genie</span>
           <span class="text-lg font-medium">Generated beautifully on ${new Date().toLocaleDateString()}</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);

    // Let the DOM settle
    await new Promise(r => setTimeout(r, 100));
    
    const targetElement = container.querySelector('#pdf-content');
    
    const canvas = await html2canvas(targetElement, {
      scale: 2, // High resolution for crisp text
      useCORS: true,
      logging: false,
      backgroundColor: '#f8fafc',
      windowWidth: 1000
    });
    
    document.body.removeChild(container);
    
    const imgData = canvas.toDataURL('image/jpeg', 0.95); // High quality jpeg
    
    // Create multipage A4 PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Scale canvas to fit PDF width
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    let page = 1;
    
    while (heightLeft > 0) {
       if (page > 1) {
         pdf.addPage();
       }
       // Draw the image shifted up by 'position'
       pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
       
       heightLeft -= pdfHeight;
       position -= pdfHeight;
       page++;
    }
    
    pdf.save(`${destName.replace(/\s+/g, '_')}_Itinerary.pdf`);

  } catch (error) {
    console.error("PDF Generation failed:", error);
    throw error;
  }
};
