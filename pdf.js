const { jsPDF } = window.jspdf;
const imageInput = document.getElementById('imageInput');
const fileNames = document.getElementById('fileNames');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');

let images = [];

imageInput.addEventListener('change', function() {
    images = Array.from(imageInput.files);
    fileNames.textContent = images.map(file => file.name).join(', ') || 'No files chosen';
    downloadBtn.disabled = images.length === 0;
});

convertBtn.addEventListener('click', function() {
    if (images.length > 0) {
        const pdf = new jsPDF('portrait', 'mm', 'a4');
        images.forEach((image, index) => {
            const img = new Image();
            img.src = URL.createObjectURL(image);
            img.onload = function() {
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = img.naturalHeight * imgWidth / img.naturalWidth;

                if (imgHeight > pdf.internal.pageSize.getHeight()) {
                    const imgHeightScaled = pdf.internal.pageSize.getHeight();
                    const imgWidthScaled = imgHeightScaled * img.naturalWidth / img.naturalHeight;
                    pdf.addImage(img, 'PNG', (imgWidth - imgWidthScaled) / 2, 0, imgWidthScaled, imgHeightScaled);
                } else {
                    pdf.addImage(img, 'PNG', 0, (pdf.internal.pageSize.getHeight() - imgHeight) / 2, imgWidth, imgHeight);
                }

                if (index < images.length - 1) {
                    pdf.addPage();
                } 
                    resolve();
                }
            });
        });

        Promise.all(imagePromises).then(() => {
            pdf.save('download.pdf');
        });
    }
});


