const mongoose = require('mongoose');
const Ticket = require('./Ticket');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      returnDocument: 'after'
    }
  );

  const currentSeq = counter?.seq ?? 1;
  const lastTicket = await Ticket.findOne({}, { id: 1 }, { sort: { id: -1 } }).lean();
  const maxExistingId = lastTicket?.id ?? 0;

  return Math.max(currentSeq, maxExistingId + 1);
}

module.exports = { Counter, getNextSequence };
