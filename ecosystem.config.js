module.exports = {
  apps: [
    {
      name: "pzFootBall",
      // pm2로 실행될 파일 경로
      script: "./bin/www",
      // 개발환경시 적용될 설정 지정
      env: {
        PORT: 3000,
        NODE_ENV: "development"
      },
      // 배포환경시 적용될 설정 지정
      env_production: {
        PORT: 8000,
        NODE_ENV: "production"
      }
    }
  ]
};
