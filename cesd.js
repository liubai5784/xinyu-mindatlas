const emotionalTests = (() => {
  const questions = [
    "平常不会让我心烦的事，这周也会困扰我。","我没什么胃口，不想吃东西。","即便有家人或朋友帮助，我还是很难摆脱低落的心情。","我觉得自己和别人一样好。","我很难把注意力放在正在做的事上。","我感到情绪低落。","无论做什么，我都觉得费劲。","我对未来抱有希望。","我觉得自己的人生很失败。","我感到害怕。","我睡得不安稳。","我感到快乐。","我比平时说话少。","我觉得孤单。","我觉得周围的人不友善。","我享受生活。","有时候我会哭起来。","我感到悲伤。","我觉得别人不喜欢我。","我提不起劲开始做事。"
  ];
  const positive = new Set([3,7,11,15]);
  return [{
    name:"流调中心抑郁量表 · CES-D",category:"情绪状态",
    desc:"用 20 项陈述回顾一周的情绪、精力、睡眠和人际感受。", kind:"研究量表 · 本站译写",
    source:"Radloff（1977），美国流行病学研究中心抑郁量表。本站根据公开英文题本译写，中文措辞未经独立验证。第 4、8、12、16 项反向计分。",
    url:"https://www.ncdhhs.gov/documents/files/center-epidemiologic-studies-depression-scale/open",
    period:"请回想包括今天在内的最近七天，选择每种体验出现的频率。",questions,
    options:["很少或没有（不到 1 天）","少数时间（1～2 天）","约半数时间（3～4 天）","大部分或全部时间（5～7 天）"],
    analyze(answers){
      const scored=answers.map((v,i)=>positive.has(i)?3-v:v);
      const total=scored.reduce((a,b)=>a+b,0);
      const frequent=questions.filter((_,i)=>!positive.has(i)&&answers[i]>=2);
      const text="分数越高，表示这周报告的抑郁相关体验整体更频繁。"+(frequent.length?"你在至少 3 天里有过以下体验："+frequent.slice(0,3).join(" ") : "每一项负向体验出现的时间均少于 3 天。")+" 四项正向体验也计入总分，出现越频繁，对应的分值越低。";
      return {score:total+" / 60",title:"过去一周的情绪体验",text,tip:"回顾这些体验何时开始、在哪些情境下明显，以及是否影响学习、睡眠或与人相处。如果感到困扰或日常功能受影响，可以带着这些具体例子与心理健康专业人员讨论。"};
    }
  }];
})();
