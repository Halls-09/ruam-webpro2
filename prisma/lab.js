// 1. นำเข้าเครื่องมือ: เรียกใช้ PrismaClient ซึ่งเปรียบเสมือน "ล่าม" ที่จะเอาไว้คุยกับ Database
const { PrismaClient } = require('@prisma/client');

// 2. สร้างตัวแทนล่าม: ตั้งชื่อว่า prisma เพื่อให้เราเรียกใช้งานได้ง่ายๆ ในบรรทัดต่อๆ ไป
const prisma = new PrismaClient();

// 3. สร้างฟังก์ชันหลัก (ต้องมี async เพราะการคุยกับ Database ต้องใช้เวลา เราต้องรอให้มันทำงานเสร็จทีละขั้น)
async function main() {
  console.log("กำลังเชื่อมต่อ Database...");

  try {
    // =======================================================
    // ข้อ 1: สร้าง Author พร้อมกับ Book ในคำสั่งเดียว
    // =======================================================
    console.log("\n--- เริ่มทำข้อ 1 ---");
    
    // สั่งให้ล่าม (prisma) ไปที่ตารางนักเขียน (author) แล้วสร้างข้อมูลใหม่ (create)
    const newAuthor = await prisma.author.create({
      data: {
        name: "J.K. Rowling", // ใส่ชื่อนักเขียน (ข้อมูลตัวแม่)
        
        // ความเจ๋งของ Prisma คือมันสร้างข้อมูล "ตัวลูก" (หนังสือ) ซ้อนเข้าไปได้เลย!
        books: {
          create: [
            { title: "Harry Potter and the Philosopher's Stone" } // ใส่ชื่อหนังสือ
          ]
        }
      }
    });
    console.log("✅ ข้อ 1 สำเร็จ: สร้างนักเขียนและหนังสือพร้อมกันเรียบร้อย");
    console.log(newAuthor); // ปริ้นท์ข้อมูลที่เพิ่งสร้างออกมาดู

    // =======================================================
    // ข้อ 2: สร้าง Category ใหม่ และเอาไปผูกกับ Book ที่มีอยู่แล้ว
    // =======================================================
    console.log("\n--- เริ่มทำข้อ 2 ---");
    
    // สเตป 2.1: ไปที่ตารางหมวดหมู่ (category) แล้วสร้างข้อมูลใหม่ชื่อ "Fantasy"
    await prisma.category.create({ 
        data: { name: "Fantasy" } 
    });
    console.log("✅ สร้างหมวดหมู่ Fantasy สำเร็จ");
    
    // สเตป 2.2: ไปที่ตารางหนังสือ (book) แล้วค้นหา (findFirst) เล่มที่ชื่อ Harry Potter
    // (เราต้องค้นหาเพื่อให้ระบบรู้ว่า "ID" ของหนังสือเล่มนี้คือเลขอะไร จะได้เอาไปอัปเดตถูกเล่ม)
    const book = await prisma.book.findFirst({
      where: { title: "Harry Potter and the Philosopher's Stone" }
    });

    // สเตป 2.3: สั่งอัปเดต (update) ข้อมูลหนังสือเล่มที่เราเพิ่งหาเจอ
    const updatedBook = await prisma.book.update({
      where: { id: book.id }, // บอกระบบว่าให้อัปเดตหนังสือเล่มที่ ID นี้นะ
      data: {
        categories: {
          // ใช้คำสั่ง connect เพื่อ "ผูกความสัมพันธ์" ระหว่างหนังสือเล่มนี้ กับหมวดหมู่ที่ชื่อ Fantasy
          connect: { name: "Fantasy" } 
        }
      }
    });
    console.log("✅ ข้อ 2 สำเร็จ: ผูกหนังสือเข้ากับหมวดหมู่เรียบร้อย");
    console.log(updatedBook); // ปริ้นท์ข้อมูลหนังสือที่อัปเดตแล้วออกมาดู

  } catch (error) {
    // ถ้ามีอะไรพังในระบบ (เช่น ใส่ข้อมูลซ้ำ, หาหนังสือไม่เจอ) ให้ปริ้นท์ Error ออกมาบอกเรา
    console.error("❌ เกิดข้อผิดพลาด:", error);
  } finally {
    // ไม่ว่าจะทำงานสำเร็จ หรือเกิด Error ท้ายที่สุดต้อง "ปิดการเชื่อมต่อ" Database เสมอ
    await prisma.$disconnect();
    console.log("\nปิดการเชื่อมต่อ Database สำเร็จ");
  }
}

// สั่งรันฟังก์ชันหลักที่เราเพิ่งเขียนไป
main();