const docToPlain = (doc) => {
  if (doc) {
    if (doc._id) {
      doc._id = doc._id.toString();
    }
    if (doc.user) {
      doc.user = doc.user.toString();
    }
    if (doc.createdAt) {
      doc.createdAt = doc.createdAt.toString();
    }
    if (doc.updatedAt) {
      doc.updatedAt = doc.updatedAt.toString();
    }
    if (doc.paidAt) {
      doc.paidAt = doc.paidAt.toString();
    }
    if (doc.deliveredAt) {
      doc.deliveredAt = doc.deliveredAt.toString();
    }
  }
  return doc;
};
export default docToPlain;
