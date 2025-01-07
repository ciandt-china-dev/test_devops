const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 触发GitHub repository dispatch事件的函数
async function triggerGithubDispatch(owner, repo, token) {
  try {
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/dispatches`,
      {
        event_type: 'bitbucket_push'
      },
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return { success: true, status: response.status };
  } catch (error) {
    console.error('Error triggering GitHub dispatch:', error.message);
    return { success: false, error: error.message };
  }
}

// API端点
app.get('/api/trigger-github/:owner/:repo/:token', async (req, res) => {
  const { owner, repo, token } = req.params;
  
  if (!owner || !repo || !token) {
    return res.status(400).json({ error: 'Missing required parameters: owner, repo, and token' });
  }

  const result = await triggerGithubDispatch(owner, repo, token);
  if (result.success) {
    res.status(200).json({ message: 'GitHub dispatch triggered successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 