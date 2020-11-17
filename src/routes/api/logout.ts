export async function get(req, res) {
  req.session.destroy(err => console.log('error destroying session', err));
  res.json({success: true})
  return;
}