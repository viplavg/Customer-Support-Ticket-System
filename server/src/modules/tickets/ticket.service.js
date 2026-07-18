import Counter from "./counter.model.js";
import Ticket from "./ticket.model.js";

export const getNextTicketNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { key: "ticket" },
    {
      $inc: { sequenceValue: 1 },
    },
    { new: true, upsert: true },
  );
  const formattedSequence = String(counter.sequenceValue).padStart(6, "0");
  return `TKT-${formattedSequence}`;
};

export const createTicket = async ({title, description, priority, category, createdBy}) => {
    const ticketNumber = await getNextTicketNumber();
    const ticket = await Ticket.create({
        ticketNumber,
        title,
        description,
        priority,
        category,
        createdBy
    });
    return ticket;
}