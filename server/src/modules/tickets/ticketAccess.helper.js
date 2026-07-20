export const validateTicketAccess = ({
  ticket,
  userId,
  role,
}) => {
  if (role === "ADMIN") {
    return;
  }

  if (role === "CUSTOMER" && !ticket.createdBy.equals(userId)) {
    throw new ApiError(
      403,
      "You are not authorized to access this ticket"
    );
  }

  if (role === "AGENT" && !ticket.assignedTo?.equals(userId)) {
    throw new ApiError(
      403,
      "You are not authorized to access this ticket"
    );
  }
};