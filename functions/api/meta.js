export async function onRequestGet() {
  const now = new Date();
  const year = now.getUTCFullYear();

  const dob = new Date(Date.UTC(2005, 0, 27));

  let age = year - dob.getUTCFullYear();

  const mNow = now.getUTCMonth();
  const dNow = now.getUTCDate();
  const mDob = dob.getUTCMonth();
  const dDob = dob.getUTCDate();

  if (mNow < mDob || (mNow === mDob && dNow < dDob)) {
    age -= 1;
  }

  return new Response(
    JSON.stringify({ year, age, dob: '2005-01-27' }),
    {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    },
  );
}
