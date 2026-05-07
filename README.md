# Pong Multiplayer (เกมพองแบบเล่นหลายคน)

โปรเจกต์นี้เป็นเกม Pong แบบ Real-time ที่พัฒนาด้วย **Angular** และ **Socket.io** โดยใช้ **HTML5 Canvas** สำหรับการแสดงผลกราฟิก เกมนี้ถูกออกแบบมาให้ผู้เล่นสองคนสามารถแข่งขันกันได้ผ่านระบบออนไลน์

## คุณสมบัติเด่น (Features)

*   **Real-time Multiplayer:** เล่นแข่งกันได้ทันทีผ่าน WebSockets (Socket.io)
*   **Server-Side Logic:** การคำนวณตำแหน่งลูกบอลและคะแนนถูกจัดการที่ฝั่ง Server เพื่อความแม่นยำและป้องกันการโกง
*   **Waiting Room:** ระบบรอผู้เล่นคนที่สองก่อนเริ่มเกม
*   **Game Over Screen:** หน้าจอแสดงผลผู้ชนะเมื่อจบการแข่งขัน
*   **Responsive Control:** รองรับการควบคุมผ่านคีย์บอร์ดทั้งปุ่มลูกศร (Arrow Keys) และ W/S

## เทคโนโลยีที่ใช้ (Tech Stack)

*   **Frontend:** [Angular](https://angular.io/) (เวอร์ชันล่าสุดพร้อม Standalone Components และ Zoneless Detection)
*   **Backend:** Node.js พร้อม [Socket.io](https://socket.io/) (รันแยกที่ port 3000)
*   **Graphics:** HTML5 Canvas API
*   **Language:** TypeScript

## วิธีการเล่น (How to Play)

*   **ผู้เล่นที่ 1 (ฝั่งซ้าย):** ใช้ปุ่ม `W` (ขึ้น) และ `S` (ลง) หรือปุ่มลูกศร
*   **ผู้เล่นที่ 2 (ฝั่งขวา):** ใช้ปุ่ม `W` (ขึ้น) และ `S` (ลง) หรือปุ่มลูกศร
*   **เป้าหมาย:** ตีลูกบอลให้ผ่านไม้ตีของคู่ต่อสู้เพื่อสะสมคะแนน

## โครงสร้างโปรเจกต์ที่สำคัญ (Project Structure)

*   `src/app/pong-canvas/`: ส่วนหลักที่จัดการการวาดภาพ (Canvas) และการเชื่อมต่อ Socket
*   `src/app/app.ts`: Root Component ของแอปพลิเคชัน
*   `src/app/app.config.ts`: การตั้งค่าแอปพลิเคชัน (เช่น Zoneless, Router)

## เพิ่มเติม

เว็บไซต์ Pong Game นี้ จำเป็นจะต้องมี backend ก่อนจะเล่นได้
**สามารถดูโปรเจกต์ Backend ของ Pong Game ได้ที่นี่:** [คลิกเพื่อดู Repository Backend ของระบบนี้](https://github.com/MunbodPRGRM/pong-game-nodejs.git)

## Live Demo

**สามารถทดลองเล่นโปรเจกต์จริงได้ที่นี่:** [คลิกเพื่อดูตัวอย่างเว็บไซต์](https://pong-game-f135d.web.app/)
