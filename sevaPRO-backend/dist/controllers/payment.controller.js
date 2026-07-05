"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletController = walletController;
function walletController(req, res) {
    res.json({
        wallet: { balance: req.user?.walletBalance || 0 },
        transactions: [
            { id: 'txn_1', label: 'Deep Cleaning', amount: -469, date: 'Today' },
            { id: 'txn_2', label: 'Referral Credit', amount: 150, date: 'Yesterday' },
            { id: 'txn_3', label: 'Refund', amount: 99, date: 'Jun 20' },
        ],
    });
}
//# sourceMappingURL=payment.controller.js.map