# **School Management System**

A robust and user-friendly platform for managing student enrollment, payments, and academic structure with seamless online access for both students and administrators.


---

<a href="https://albabacademy.org" target="_blank">
  <img src="https://img.shields.io/badge/Visit-Albab%20Academy-blue?style=for-the-badge" alt="Visit Albab Academy">
</a>

## **Features**

### **Student Enrollment Flow**
- Assign students to a cohort linked to a section and grade.
- Ensure each student has a **unique roll number** within their cohort.
- Collect mandatory information during enrollment with optional fields editable later.
- Enable students to create a **username** and **password** for secure dashboard access.
- Provide the ability to **update or reset passwords** after initial setup.

### **Payment Flow**

#### **Payment Templates**
- Create reusable payment templates with details such as `[description]` and `[amount]`.
- Support multiple fields in a template for dynamic total calculation.
- Automatically generate **detailed invoices** using template field data.

#### **Payment Request Creation**
- Generate payment requests using payment templates for:
  - Individual students.
  - Entire grades, sections, or cohorts.
  - Teachers.
- Automatically create payment entries in the payments table for each target group member.
- Notify members about payment requests.

#### **Enrollment-Linked Payments**
- Option to select a payment template for enrollment fees.
- If payment is marked as paid:
  - **Invoice automatically generated and downloaded** upon enrollment completion.
- If payment is not marked as paid:
  - Payment can be completed later by the student or admin.

---

## **Technology Stack**
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Prisma (PostgreSQL/MySQL)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

---

