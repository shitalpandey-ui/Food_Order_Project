// Turns multer's req.files into the {public_id, url} shape used by the
// Restaurant and FoodItem models' `images` arrays, using the request host so
// links work regardless of environment.
module.exports = function buildImagesFromFiles(req) {
  if (!req.files || req.files.length === 0) return [];

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return req.files.map((file) => ({
    public_id: file.filename,
    url: `${baseUrl}/media/${file.filename}`,
  }));
};
