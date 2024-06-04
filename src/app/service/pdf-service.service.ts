import { Injectable } from '@angular/core';
// import * as jspdf from 'jspdf';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {

  constructor(private apiService:ApiService) { }

  
  generatePdfOLD(htmlContent: HTMLElement, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        html2canvas(htmlContent, {
            scale: 2, // Lower scale to reduce resolution
            useCORS: true
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const pdf = new jsPDF();
            const imgWidth = pdf.internal.pageSize.getWidth();
            // const imgWidth = 210.0015555555555;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            // const imgHeight = 1141.874076562624;
            let position = 0;
            let pageHeight = pdf.internal.pageSize.getHeight();
            console.log('imgWidth',imgWidth);
            console.log('imgHeight',imgHeight);
            // Add the first page
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            let heightLeft = imgHeight - pageHeight;
            // Add subsequent pages for the remaining content
            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(fileName + '.pdf');
            const blob = pdf.output('blob');
            this.uploadPdfToS3(blob, fileName); // Upload the Blob to S3
            resolve('hideloader');
        }).catch(error => {
            reject(error);
        });
    });
  }

  generatePdf(htmlContent: HTMLElement, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        html2canvas(htmlContent, {
            scale: 2, // Lower scale to reduce resolution
            useCORS: true
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const pdf = new jsPDF();
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let position = 0;
            let pageHeight = pdf.internal.pageSize.getHeight();

            // Add the first page
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);

            let heightLeft = imgHeight - pageHeight;

            // Add subsequent pages for the remaining content
            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(fileName + '.pdf');
            const blob = pdf.output('blob');
            this.uploadPdfToS3(blob, fileName); // Upload the Blob to S3
            resolve('hideloader');
        }).catch(error => {
            reject(error);
        });
    });
  }
  downloadPdf(data: Blob, username:string) : Observable<string> {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}_report.pdf`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    this.uploadPdfToS3(blob, `${username}_report`); // Upload the Blob to S3
    return of('hideloader');
  }

  
  private uploadPdfToS3(pdfBlob: Blob, fileName: string) {
  
    const timestamp = new Date().getTime();
      const uniqueId = Math.floor(Math.random() * 100000000);
      var random_no = parseInt(`${timestamp}${uniqueId}`, 10) % 100000000;
    let obj = {
      "filename": random_no+'_report.pdf'
    }
    var globaldata=JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');
   if(!sessionStorage.getItem('pdfdownload')){
    this.apiService.uploadFileUrl(obj).subscribe(async (data) => {
      if ('uploadURL' in data && data.uploadURL) {
        // console.log(data);
        const result = await fetch(`${data['uploadURL']}`, {
          method: 'PUT',
          body: pdfBlob
        })

        // console.log('RESULT',result);
        var latestReportPDF = (`${data['uploadURL']}`).split("?")[0];

        if (data['uploadURL']) {
          let oldpdf = sessionStorage.getItem('old_pdf');
          let latestpdf = sessionStorage.getItem('latest_pdf');
          // console.log(oldpdf)
          // console.log(latestpdf)
          if(sessionStorage.getItem('latest_pdf')){
            let currentpdf = sessionStorage.getItem('latest_pdf') || '';
            sessionStorage.setItem('old_pdf', currentpdf);
          }
          sessionStorage.setItem('latest_pdf', latestReportPDF);

          

          var obj={
            globaldata:globaldata.member,
            Name: globaldata.name,
            Mobile: sessionStorage.getItem('RMMobile'),
            marketing_id: sessionStorage.getItem('marketing_id'),
            journey_continuation_link:latestReportPDF,
            remarks_c:sessionStorage.getItem('old_pdf') || ''
          }
          this.apiService.updatecrm(obj).subscribe((data:any)=>{
          })
          // console.log("Image has been uploaded successfully");

          var updatelead = {
            "latest_pdf_url":sessionStorage.getItem('latest_pdf'),
            "old_pdf_url":sessionStorage.getItem('old_pdf'),
            "lead_id":sessionStorage.getItem('leadId'),
            "mobile":sessionStorage.getItem('RMMobile'),
            "sum_assured":sessionStorage.getItem('Total SumAssured')
          }
          // console.log("PDFF",updatelead)
            this.apiService.updateLeadPdf(updatelead).subscribe((data:any)=>{
            });
            var planoutput=JSON.parse(sessionStorage.getItem('planoutputs') || '{}');

            var whatsapp_obj={
              mobile : sessionStorage.getItem('RMMobile'),
              name :  globaldata.name,
              pdfurl : sessionStorage.getItem('latest_pdf'),
              sum_assured : planoutput.output_2,
              base_amount: planoutput.Base_amount,
              topup:planoutput.topUp
            }
            this.apiService.sendWhatsapp(whatsapp_obj).subscribe((data:any)=>{
             
            });


        }
      }
    }, err => {
      console.log(err);
    });
   }else{

      var planoutput=JSON.parse(sessionStorage.getItem('planoutputs') || '{}');

      var whatsapp_obj={
        mobile : sessionStorage.getItem('RMMobile'),
        name :  globaldata.name,
        pdfurl : sessionStorage.getItem('latest_pdf'),
        sum_assured : planoutput.output_2,
        base_amount: planoutput.Base_amount,
        topup:planoutput.topUp
      }
      this.apiService.sendWhatsapp(whatsapp_obj).subscribe((data:any)=>{
      
      });

   }
  };

  getPdfURL_share(htmlContent: HTMLElement,mobileNumber:any,sum_assured:any,Base_amount:any,topUp:any) {
    html2canvas(htmlContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 297; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      // pdf.save(fileName + '.pdf');

      // Convert PDF data to Blob
      const pdfBlob = pdf.output('blob');
      // Upload the Blob to S3
      const timestamp = new Date().getTime();
      const uniqueId = Math.floor(Math.random() * 100000000);
      var random_no = parseInt(`${timestamp}${uniqueId}`, 10) % 100000000;
    let obj = {
      "filename": random_no+'_report.pdf'
    }

      this.apiService.uploadFileUrl(obj).subscribe(async (data) => {
        if ('uploadURL' in data && data.uploadURL) {
          // console.log(data);
          const result = await fetch(`${data['uploadURL']}`, {
            method: 'PUT',
            body: pdfBlob
          })
  
          // console.log('RESULT',result);
          var latestReportPDF = (`${data['uploadURL']}`).split("?")[0];
  
          if (data['uploadURL']) {
            let oldpdf = sessionStorage.getItem('old_pdf');
            let latestpdf = sessionStorage.getItem('latest_pdf');
            if(sessionStorage.getItem('latest_pdf')){
              let currentpdf = sessionStorage.getItem('latest_pdf') || '';
              sessionStorage.setItem('old_pdf', currentpdf);
            }
            sessionStorage.setItem('latest_pdf', latestReportPDF);
          var globaldata=JSON.parse(sessionStorage.getItem('FINAL_global_data') || '{}');

               var obj1={
        mobile : mobileNumber,
        name :  globaldata.name,
        pdfurl : latestReportPDF,
        sum_assured :sum_assured,
        base_amount:Base_amount,
        topup:topUp
      }
        this.apiService.sendWhatsapp(obj1).subscribe((data:any)=>{
          // console.log("datata...",data);
        });


            var obj={
              globaldata:globaldata.member,
              Name: globaldata.name,
              Mobile: sessionStorage.getItem('RMMobile'),
              marketing_id: sessionStorage.getItem('marketing_id'),
              journey_continuation_link:latestReportPDF,
              remarks_c:sessionStorage.getItem('old_pdf') || ''
            }
            this.apiService.updatecrm(obj).subscribe((data:any)=>{
            })
          }
        }

      }, err => {
        console.log(err);
      });
    });
 
  };
   

}
