import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

/**
 * การตั้งค่าหลักของแอปพลิเคชัน Angular
 * ประกอบด้วย Providers ต่างๆ ที่จำเป็นสำหรับการทำงานของแอป
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // จัดการ Error ที่เกิดขึ้นใน Browser ทั่วทั้งแอป
    provideBrowserGlobalErrorListeners(),
    // เปิดใช้งานการตรวจจับการเปลี่ยนแปลงแบบ Zoneless (เพื่อประสิทธิภาพที่ดีขึ้นใน Angular รุ่นใหม่)
    provideZonelessChangeDetection(),
    // ตั้งค่าระบบ Routing โดยใช้เส้นทางที่กำหนดใน app.routes.ts
    provideRouter(routes)
  ]
};
