const batteryTests = [...new Set(reflectionTests.map(t => t.category))].map(category => {
  const parts = reflectionTests.filter(t => t.category === category);
  const questions = parts.flatMap(t => t.questions);
  return {
    name: category + ' · 综合长卷', category, kind: '原创组合问卷',
    desc: '一次完成'+parts.map(t=>t.name).join('、')+'六个主题，查看各主题的行为频率和建议。',
    sections: parts.map((t,i)=>({end:(i+1)*t.questions.length,name:t.name})), period: parts[0].period, questions, options: parts[0].options,
    source: '本站原创组合问卷。与同主题单项自评共用题目，仅作日常反思，未经信效度及常模检验。',
    analyze(answers) {
      let start=0;
      const reports=parts.map(t=>{
        const end=start+t.questions.length, r=t.analyze(answers.slice(start,end));
        start=end;
        return {name:t.name,...r};
      });
      return {score:'6 项主题报告',title:category+' · 个人回顾',parts:reports,text:reports.map(r=>r.name+' '+r.score).join('、'),tip:'从报告中选一个与你近期经历相符的小建议，尝试一周后记录它在哪种情境下有帮助。'};
    }
  };
});
