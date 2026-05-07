import { Component, ElementRef, HostListener, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';

/**
 * Component สำหรับจัดการส่วนแสดงผลเกม Pong และการเชื่อมต่อผ่าน Socket.io
 */
@Component({
  selector: 'app-pong-canvas',
  standalone: true, // กำหนดให้เป็น Standalone Component
  imports: [],
  templateUrl: './pong-canvas.html',
  styleUrl: './pong-canvas.scss',
})
export class PongCanvas implements OnInit, AfterViewInit, OnDestroy {
  // เข้าถึงแท็ก Canvas จาก HTML เพื่อใช้ในการวาดกราฟิก
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D; // context สำหรับวาด 2D
  private socket!: Socket; // ตัวแปรสำหรับจัดการการเชื่อมต่อ Socket.io

  // เก็บสถานะของผู้เล่นคนนี้ (เช่น 'player1', 'player2' หรือ 'spectator')
  playerRole: string = '';

  /**
   * สถานะของเกม (Game State)
   * ข้อมูลนี้จะถูกปรับปรุง (Sync) มาจาก Server อย่างต่อเนื่อง
   */
  gameState = {
    paddle1: { x: 10, y: 250, width: 15, height: 100 }, // ไม้ตีฝั่งซ้าย
    paddle2: { x: 775, y: 250, width: 15, height: 100 }, // ไม้ตีฝั่งขวา
    ball: { x: 400, y: 300, radius: 10 }, // ลูกบอล
    score1: 0, // คะแนนผู้เล่น 1
    score2: 0, // คะแนนผู้เล่น 2
    status: 'waiting', // สถานะเกม: waiting, playing, gameover
    winner: '' // ชื่อผู้ชนะเมื่อจบเกม
  };

  /**
   * เริ่มต้นการเชื่อมต่อ Socket เมื่อ Component ถูกสร้าง
   */
  ngOnInit(): void {
    // เชื่อมต่อไปยัง Server ที่รันอยู่ที่ port 3000
    this.socket = io('https://pong-game-nodejs.onrender.com');

    // รับแจ้งจาก Server ว่าเราได้เล่นฝั่งไหน
    this.socket.on('playerRole', (role: string) => {
      this.playerRole = role;
      console.log('คุณรับบทเป็น:', this.playerRole);
    });

    // รับข้อมูลสถานะเกมล่าสุดจาก Server แบบ Real-time
    this.socket.on('gameState', (state: any) => {
      this.gameState = state;
    });
  }

  /**
   * หลังจาก View ถูกสร้างเสร็จ ให้เริ่มต้น Canvas และเริ่ม Game Loop
   */
  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.gameLoop(); // เริ่มต้นการวาดภาพวนซ้ำ
  }

  /**
   * ตัดการเชื่อมต่อ Socket เมื่อปิดหน้าจอหรือทำลาย Component
   */
  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * ดักจับเหตุการณ์การกดปุ่มบนคีย์บอร์ดเพื่อเลื่อนไม้ตี
   * @param event ข้อมูลเหตุการณ์การกดปุ่ม
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // ถ้าไม่ใช่ผู้เล่น (เช่น เป็นคนดู) จะกดเลื่อนไม่ได้
    if (this.playerRole !== 'player1' && this.playerRole !== 'player2') return;

    // หาตำแหน่งปัจจุบันของไม้ตีเรา
    let myPaddleY = this.playerRole === 'player1' ? this.gameState.paddle1.y : this.gameState.paddle2.y;
    const speed = 25; // ระยะทางที่เลื่อนต่อการกดหนึ่งครั้ง

    // ตรวจสอบปุ่มที่กด (รองรับทั้ง Arrow Keys และ W/S)
    if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
      myPaddleY -= speed;
    } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
      myPaddleY += speed;
    }

    // จำกัดไม่ให้ไม้ตีหลุดออกนอกขอบจอ (ความสูงจอ 600, ความสูงไม้ 100)
    if (myPaddleY < 0) myPaddleY = 0;
    if (myPaddleY > 600 - 100) myPaddleY = 500;

    // ส่งตำแหน่งใหม่ไปให้ Server ประมวลผล
    this.socket.emit('movePaddle', { y: myPaddleY });
  }

  /**
   * วาดรูปสี่เหลี่ยม
   */
  drawRect(x: number, y: number, w: number, h: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  /**
   * วาดรูปวงกลม (ลูกบอล)
   */
  drawCircle(x: number, y: number, r: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * วาดเส้นตาข่ายกลางสนาม
   */
  drawNet() {
    for (let i = 0; i <= this.canvasRef.nativeElement.height; i += 30) {
      this.drawRect(this.canvasRef.nativeElement.width / 2 - 1, i, 2, 20, '#fff');
    }
  }

  /**
   * ฟังก์ชันสำหรับวาดภาพทั้งหมดลงบน Canvas ตามข้อมูล Game State ล่าสุด
   */
  render() {
    // ล้างหน้าจอด้วยสีดำ
    this.drawRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height, '#000');

    // วาดตาข่าย
    this.drawNet();

    // วาดไม้ตีทั้งสองฝั่ง
    this.drawRect(this.gameState.paddle1.x, this.gameState.paddle1.y, this.gameState.paddle1.width, this.gameState.paddle1.height, '#fff');
    this.drawRect(this.gameState.paddle2.x, this.gameState.paddle2.y, this.gameState.paddle2.width, this.gameState.paddle2.height, '#fff');

    // วาดลูกบอล
    this.drawCircle(this.gameState.ball.x, this.gameState.ball.y, this.gameState.ball.radius, '#fff');

    // วาดคะแนน
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'center';
    this.ctx.font = '50px Arial';
    this.ctx.fillText(this.gameState.score1.toString(), this.canvasRef.nativeElement.width / 4, 100);
    this.ctx.fillText(this.gameState.score2.toString(), (3 * this.canvasRef.nativeElement.width) / 4, 100);

    // แสดงหน้าจอรอผู้เล่น (Waiting for Player 2)
    if (this.gameState.status === 'waiting') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

      this.ctx.fillStyle = '#fff';
      this.ctx.font = '40px Arial';
      this.ctx.fillText('Waiting for Player 2...', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2);
    }

    // แสดงหน้าจอเมื่อจบเกม (Game Over)
    else if (this.gameState.status === 'gameover') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

      this.ctx.fillStyle = '#FFD700'; // สีทอง
      this.ctx.font = '60px Arial';
      this.ctx.fillText(this.gameState.winner, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2);

      this.ctx.fillStyle = '#fff';
      this.ctx.font = '20px Arial';
      this.ctx.fillText('Next match starts in 5 seconds...', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 50);
    }
  }

  /**
   * ลูปการทำงานหลักของเกม ใช้สำหรับสั่งวาดภาพซ้ำๆ
   */
  gameLoop = () => {
    this.render(); // วาดภาพ
    requestAnimationFrame(this.gameLoop); // เรียกตัวเองซ้ำในเฟรมถัดไป
  }
}