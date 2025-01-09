const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 触发GitHub repository dispatch事件的函数
async function triggerGithubDispatch(owner, repo, token) {
  console.log(`[${new Date().toISOString()}] 开始触发GitHub Dispatch事件......`);
  console.log(`[${new Date().toISOString()}] 目标仓库: ${owner}/${repo}`);
  
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
    console.log(`[${new Date().toISOString()}] 请求URL: ${url}`);
    
    const response = await axios.post(
      url,
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
    
    console.log(`[${new Date().toISOString()}] GitHub API调用成功`);
    console.log(`[${new Date().toISOString()}] 响应状态码: ${response.status}`);
    
    return { success: true, status: response.status };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] GitHub API调用失败`);
    console.error(`[${new Date().toISOString()}] 错误信息: ${error.message}`);
    
    if (error.response) {
      console.error(`[${new Date().toISOString()}] 响应状态码: ${error.response.status}`);
      console.error(`[${new Date().toISOString()}] 响应数据:`, error.response.data);
    }
    
    if (error.config) {
      console.error(`[${new Date().toISOString()}] 请求配置:`, {
        url: error.config.url,
        method: error.config.method,
        headers: {
          ...error.config.headers,
          'Authorization': '***' // 隐藏token
        }
      });
    }
    
    return { 
      success: false, 
      error: error.message,
      status: error.response?.status,
      details: error.response?.data
    };
  }
}

// 处理GitHub触发请求的函数
async function handleTriggerRequest(req, res) {
  const { owner, repo, token } = req.params;
  const method = req.method;
  
  console.log(`[${new Date().toISOString()}] 收到新的触发请求 [${method}]`);
  console.log(`[${new Date().toISOString()}] 请求参数: owner=${owner}, repo=${repo}`);
  
  if (!owner || !repo || !token) {
    const missingParams = [];
    if (!owner) missingParams.push('owner');
    if (!repo) missingParams.push('repo');
    if (!token) missingParams.push('token');
    
    console.error(`[${new Date().toISOString()}] 请求参数缺失: ${missingParams.join(', ')}`);
    return res.status(400).json({ error: 'Missing required parameters: owner, repo, and token' });
  }

  const result = await triggerGithubDispatch(owner, repo, token);
  if (result.success) {
    console.log(`[${new Date().toISOString()}] 请求处理成功`);
    res.status(200).json({ message: 'GitHub dispatch triggered successfully' });
  } else {
    console.error(`[${new Date().toISOString()}] 请求处理失败`);
    res.status(500).json({ 
      error: result.error,
      status: result.status,
      details: result.details
    });
  }
}

// API端点 - 支持GET和POST
app.get('/api/trigger-github/:owner/:repo/:token', handleTriggerRequest);
app.post('/api/trigger-github/:owner/:repo/:token', handleTriggerRequest);

// 健康检查端点
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] 健康检查请求...`);
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] 服务器启动在端口 ${PORT}`);
}); 