import React, { useState, useEffect } from "react";
import { Button, Input, Select, Card } from "@/components/ui";
import { motion } from "framer-motion";
import Image from "next/image";

const prizes = [10000, 10000, 10000, 10000, 50000, 20000, 20000, 10000];

export default function TetLixi() {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [banks, setBanks] = useState([]);
  const [openedBoxes, setOpenedBoxes] = useState(Array(8).fill(false));
  const [selectedPrize, setSelectedPrize] = useState(null);

  useEffect(() => {
    fetch("https://qr.sepay.vn/banks.json")
      .then((res) => res.json())
      .then((data) => setBanks(data));
  }, []);

  const openBox = (index) => {
    if (openedBoxes[index] || !name || !account || !bank) return;
    setOpenedBoxes((prev) => {
      const newBoxes = [...prev];
      newBoxes[index] = true;
      return newBoxes;
    });
    setSelectedPrize(prizes[index]);
  };

  const qrLink = selectedPrize
    ? `https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${selectedPrize}&des=DUY%20-%20CHUC%20MUNG%20NAM%20MOI%202025&template=qronly&download=TRUE`
    : "";

  return (
    <div className="p-6 text-center bg-red-500 min-h-screen">
      <h1 className="text-3xl text-white mb-4">Lì Xì Tết 2025 🎉</h1>
      <div className="mb-4">
        <Input placeholder="Nhập tên của bạn" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Nhập số tài khoản" value={account} onChange={(e) => setAccount(e.target.value)} className="mt-2" />
        <Select value={bank} onChange={(e) => setBank(e.target.value)} className="mt-2">
          <option value="">Chọn ngân hàng</option>
          {banks.map((b) => (
            <option key={b.code} value={b.code}>{b.short_name}</option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {prizes.map((_, index) => (
          <motion.div
            key={index}
            className="p-4 bg-yellow-300 rounded-xl cursor-pointer"
            onClick={() => openBox(index)}
            whileTap={{ scale: 0.9 }}
          >
            {openedBoxes[index] ? `🎁 ${prizes[index]} VNĐ` : "🧧"}
          </motion.div>
        ))}
      </div>
      {selectedPrize && (
        <Card className="mt-4 p-4">
          <p className="text-lg font-bold">Chúc mừng {name}! Bạn nhận được {selectedPrize} VNĐ</p>
          <Image src={qrLink} alt="QR Code" width={200} height={200} className="mx-auto mt-2" />
          <a href={qrLink} download className="mt-2 inline-block bg-blue-500 text-white p-2 rounded">Tải QR</a>
        </Card>
      )}
    </div>
  );
}
