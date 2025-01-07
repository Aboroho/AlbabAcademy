"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

import { formatDate, numberToWords } from "@/lib/utils";
import Logo from "@/assets/images/logo_abstract.png";
// Styles similar to your Tailwind classes but for react-pdf
const styles = StyleSheet.create({
  borderTop: {
    borderTop: "1px solid #000",
    paddingTop: "4",
  },

  borderBottom: {
    borderBottom: "1px solid #000",
  },
  fontSmall: {
    fontSize: 12,
  },
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid black",
    paddingBottom: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#896F11",
    fontWeight: "bold",
  },
  schoolInfo: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "bold",
  },

  receiptDetails: {
    fontSize: 12,
    color: "#4b5563",
  },
  section: {
    marginBottom: 20,

    paddingBottom: 10,
  },
  table: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 10,
    fontSize: 10,
    border: "1px solid black",
  },
  feeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: {
    fontSize: 12,
    textAlign: "right",
    fontWeight: "bold",
  },
  signatureSection: {
    position: "absolute",
    bottom: 35,
    width: "90%",

    flexDirection: "row",
    justifyContent: "space-between",

    textAlign: "center",
    fontSize: 12,
  },

  spacedElement: {
    display: "flex",
    flexDirection: "column",
    gap: "4",
  },
});

// Font for text number to words conversion (optional)
Font.register({
  family: "Roboto",
  src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
});

type Props = {
  invoiceID?: string;

  forDate?: string;
  name: string;
  studentGrade: string;
  studentCohort: string;
  studentSection: string;
  studentID: string;
  mobile?: string | null;
  fees: {
    amount: number;
    details: string;
    id?: number;
    [key: string]: unknown;
  }[];
  paymentDetails?: {
    amount: number;
    date: Date | string;
  }[];
  stipend: number;
};
const StudentInvoice = ({
  invoiceID,
  forDate,
  name,
  studentGrade,
  studentSection,
  studentCohort,
  studentID,
  mobile,
  fees,
  paymentDetails,
  stipend = 0,
}: Props) => {
  const total = fees.reduce((acc, cur) => acc + cur.amount, 0);
  const paid = paymentDetails?.reduce((sum, cur) => sum + cur.amount, 0) || 0;

  const due = total - paid - stipend;
  const date = formatDate(
    paymentDetails?.[paymentDetails.length - 1].date || new Date(),
    {
      includeHour: true,
      includeMinute: true,
    }
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View
              style={{
                display: "flex",
                gap: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image src={Logo.src} style={{ height: 42, width: "auto" }} />
              <Text style={styles.title}>Albab Academy</Text>
            </View>
            <Text style={styles.schoolInfo}>
              House no 51, M A Bari Road (Air Club)
            </Text>
            <Text style={styles.schoolInfo}>Sonadanga, Khulna, Bangladesh</Text>
          </View>
          <View style={[{ paddingTop: 5 }, styles.spacedElement]}>
            <Text style={styles.receiptDetails}>
              Payment ID: {invoiceID ?? ""}
            </Text>
            <Text style={{ fontSize: 12, color: "#000" }}>
              Payment Date: <Text>{date}</Text>
            </Text>
          </View>
        </View>

        {/* Month Info */}
        {forDate && (
          <View style={[styles.section, styles.borderBottom]}>
            <Text>
              <Text>
                <Text style={styles.schoolInfo}>For Month: </Text>
                {<Text style={{ fontSize: 12 }}>{forDate}</Text>}
              </Text>
            </Text>
          </View>
        )}

        {/* Student Info */}
        <View style={styles.section}>
          <View style={styles.feeDetails}>
            <View style={styles.spacedElement}>
              <Text>
                <Text style={styles.schoolInfo}>Student Name: </Text>
                <Text style={styles.fontSmall}>{name}</Text>
              </Text>

              <Text>
                <Text style={styles.schoolInfo}>Student ID: </Text>
                <Text style={styles.fontSmall}>{studentID}</Text>
              </Text>
              <Text>
                <Text style={styles.schoolInfo}>Phone: </Text>
                <Text style={styles.fontSmall}>{mobile}</Text>
              </Text>
            </View>
            <View>
              <Text>
                <Text style={styles.schoolInfo}>Grade/Class: </Text>
                <Text style={styles.fontSmall}>{studentGrade}</Text>
              </Text>
              <Text>
                <Text style={styles.schoolInfo}>Section: </Text>
                <Text style={styles.fontSmall}>{studentSection}</Text>
              </Text>
              <Text>
                <Text style={styles.schoolInfo}>Cohort/Group: </Text>
                <Text style={styles.fontSmall}>{studentCohort}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Fees Table */}
        <View style={[styles.section]}>
          <Text style={{ fontSize: 14, paddingBottom: 10 }}>Summary</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Fee Details
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Amount (TK)
              </Text>
            </View>
            {/* Table Rows */}
            {fees.map((fee) => (
              <View style={styles.tableRow} key={fee.details}>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {fee.details}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {fee.amount.toFixed(2)} Taka
                  {fee.amount > 0 && (
                    <Text style={{ color: "#6b7280", fontSize: 10 }}>
                      ({numberToWords(fee.amount)} Taka Only)
                    </Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total Section */}
        <View style={{ width: "50%", marginLeft: "auto", fontSize: 12 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ padding: "4 10" }}>Sub Total</Text>
            <Text style={{ padding: "4 10" }}>{total} BDT</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ padding: "4 10" }}>Stipend</Text>
            <Text style={{ padding: "4 10" }}>-{stipend} BDT</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderTop: "1px dashed #000",
            }}
          >
            <Text style={{ padding: "4 10" }}>Payable</Text>
            <Text style={{ padding: "4 10" }}> {total - stipend} BDT</Text>
          </View>
        </View>

        <View style={[styles.section]}>
          <Text style={{ fontSize: 14, paddingBottom: 10 }}>Payments</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Paid Amount (TK)
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Date
              </Text>
            </View>
            {/* Table Rows */}
            {paymentDetails?.map((pd) => (
              <View style={styles.tableRow} key={pd.amount}>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {pd.amount} Taka
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {formatDate(pd.date, {
                    includeHour: true,
                    includeMinute: true,
                  })}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Due Section */}
        <View style={{ width: "50%", marginLeft: "auto", fontSize: 12 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ padding: "4 10" }}>Total Paid</Text>
            <Text style={{ padding: "4 10", color: "green" }}>{paid} BDT</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderTop: "1px dashed #000",
            }}
          >
            <Text style={{ padding: "4 10" }}>Due</Text>
            <Text style={{ padding: "4 10", color: "red" }}>{due} BDT</Text>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.borderTop}>Chairman</Text>
          <Text style={styles.borderTop}>Auditor</Text>
          <Text style={styles.borderTop}>Principal</Text>
          <Text style={styles.borderTop}>Vice-Principal</Text>
          <Text style={styles.borderTop}>Accountant</Text>
        </View>
      </Page>
    </Document>
  );
};

export default StudentInvoice;
