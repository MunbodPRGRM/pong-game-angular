import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PongCanvas } from "./pong-canvas/pong-canvas";
import { FormsModule } from '@angular/forms';

/**
 * Root Component ของแอปพลิเคชัน
 * ทำหน้าที่เป็นหน้าหลักที่รวม Component ต่างๆ เข้าด้วยกัน
 */
@Component({
  selector: 'app-root',
  standalone: true, // กำหนดให้เป็น Standalone Component
  imports: [
    PongCanvas, 
    FormsModule
  ], // นำเข้า PongCanvas เพื่อใช้งานใน Template
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // ชื่อของโปรเจกต์
  protected title = 'pong-multiplayer';
}
