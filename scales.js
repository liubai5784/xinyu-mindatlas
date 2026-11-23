const standardTests = (() => {
  const period = "过去两周，以下情况出现得有多频繁？";
  const options = ["完全没有", "有几天", "超过一半的天数", "几乎每天"];
  const phq = ["做事时提不起劲或没有兴趣", "感到心情低落、沮丧或绝望", "入睡困难、睡不安稳或睡得过多", "觉得疲倦或没有活力", "食欲不振或吃得太多", "觉得自己很糟、很失败，或让自己或家人失望", "难以集中注意力，例如读报纸或看电视时", "动作或说话比平时缓慢到别人已经察觉，或相反，比平常更烦躁、坐立不安", "想到不如死掉，或想用某种方式伤害自己"];
  const gad = ["感觉心神不安、焦虑或高度紧张", "不能停止或控制担心", "为各种各样的事情过度担心", "难以放松", "非常不安静以至于难以坐定", "变得易恼火或易急躁", "害怕发生可怕的事情"];
  const phqURL = "https://www.sbirtoregon.org/wp-content/uploads/PHQ-9-Chinese.pdf";
  const gadURL = "https://projectteachny.org/app/uploads/2022/07/GAD7_Simplified-Chinese-for-Mainland-China.pdf";
  const credit = "Spitzer、Williams、Kroenke 等编制，Pfizer 教育资助";
  const total = a => a.reduce((sum, n) => sum + n, 0);
  function profile(a, items) {
    const peak = Math.max(...a);
    if (!peak) return "你在本次列出的各项体验上都选择了最低频率。";
    const selected = items.filter((_,i) => a[i] === peak);
    return "出现频率最高的体验包括“" + selected.slice(0,2).join("”和“") + "”。";
  }
  const safety = "如果你现在可能伤害自己或难以保证安全，请立即到有人陪伴的地方，请身边的人联系当地急救或陪你去急诊。如果此刻安全，也请今天告诉一位可信任的人，并尽快联系专业人员。";
  function full(name, desc, questions, url, thresholds, levels, labels) {
    return {name, category:"情绪状态", desc, source:credit, url, period, options, questions,
      analyze(a) {
        const s = total(a);
        const level = thresholds.filter(n => s >= n).length;
        const risk = questions === phq && a[8] > 0;
        return {score:s + " / " + (questions.length*3), title:risk ? "优先关注你的安全" : levels[level],
          text:(risk ? "你提到过与死亡或自伤有关的念头，这一项值得单独关注。总分对应“"+levels[level]+"”。" : "") + profile(a, labels),
          tip:risk ? safety : (s >= 10 ? "建议预约心理健康专业人员，带上本次回答和它们影响学习、工作或生活的具体例子。" : "留意这些体验是否影响日常生活。如果持续困扰你，即使分数较低，也可以寻求专业支持。")};
      }};
  }
  function brief(name, desc, questions, url, next) {
    return {name, category:"情绪状态", desc, source:credit, url, period, options, questions,
      analyze(a) {
        const s = total(a);
        return {score:s+" / 6", title:s >= 3 ? "达到进一步评估的参考线" : "低于常用筛查参考线",text:profile(a, questions)+" 两题合计达到 3 分时，通常建议进一步评估。",tip:s >= 3 ? "可继续填写"+next+"，并与专业人员讨论困扰持续了多久、有哪些生活影响。" : "若仍有持续困扰，可以直接和专业人员讨论，或用"+next+"了解更多相关体验。"};
      }};
  }
  return [
    full("抑郁症状筛查 · PHQ-9","从兴趣、精力、睡眠等方面回顾近期状态。",phq,phqURL,[5,10,15,20],["症状很少","轻度症状范围","中度症状范围","中重度症状范围","重度症状范围"],["兴趣下降","情绪低落","睡眠变化","精力不足","食欲变化","自我否定","注意力困难","动作或活动水平变化","死亡或自伤念头"]),
    full("焦虑症状筛查 · GAD-7","了解担忧、紧张和难以放松出现的频率。",gad,gadURL,[5,10,15],["症状很少","轻度症状范围","中度症状范围","重度症状范围"],gad),
    {name:"心理困扰 · K6",category:"情绪状态",desc:"回顾一个月里紧张、沮丧和做事费力等体验。",source:"Kessler 等 (2003), Screening for serious mental illness in the general population. © Ronald C. Kessler, PhD. All rights reserved.", url:"https://rckessler.scholars.harvard.edu/k10-and-k6-scales",period:"过去 30 天里，你有多少时间有以下感受？",questions:["感到紧张","感到绝望","感到不安或烦躁","太沮丧，以至于什么都不能让自己愉快起来","觉得做每件事都很费劲","觉得自己没有价值"],options:["全部时间","大部分时间","一部分时间","偶尔","无"],analyze(a){
      const scores = a.map(n => 4-n), s = total(scores);
      return {score:s+" / 24",title:s>=13?"达到高度心理困扰筛查参考线":"低于高度心理困扰筛查参考线",text:profile(scores,["紧张","绝望","不安","难以愉快","做事费力","价值感低落"])+" 得分越高，表示过去一个月报告的困扰越频繁。",tip:s>=13?"建议与专业人员讨论近期变化及日常生活受影响的程度。":"可以记下哪种场合让这些感受加重，以及什么能帮助你恢复。"};
    }},
    {name:"焦虑与抑郁初筛 · PHQ-4", category:"情绪状态",desc:"同时了解担忧与低落两个方面。",source:"Kroenke 等 (2009)，PHQ-4",url:"https://www.nih.gov/node/21506",period,options,questions:[...gad.slice(0,2),...phq.slice(0,2)],analyze(a){
      const g=a[0]+a[1],p=a[2]+a[3],s=g+p;
      return {score:s+" / 12",title:["困扰程度很低","轻度困扰范围","中度困扰范围","重度困扰范围"][Math.min(3,Math.floor(s/3))],text:"焦虑分项 "+g+" / 6，抑郁分项 "+p+" / 6。任一分项达到 3 分时，建议针对该方向进一步评估。",tip:(g>=3?"可以通过 GAD-7 进一步了解焦虑体验。":"")+(p>=3?"可以通过 PHQ-9 进一步了解情绪和兴趣变化。":"")||( "如果近期状态发生变化，可以记录影响生活的具体情境。")};
    }},
    {name:"大五人格速览 · TIPI", category:"人格探索", desc:"从外向性、宜人性、尽责性、情绪稳定性与开放性五个维度观察自己。", source:"Gosling、Rentfrow 与 Swann (2003)，本站据英文版译写", url:"https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/",period:"每题的两个词共同描述一种倾向。请判断它们整体上与你平常的表现有多相符。",questions:["外向，热情","爱挑剔，容易与人争论","值得信赖，自律","容易焦虑，容易心烦","乐于尝试新体验，内心丰富复杂","内敛，安静","体谅别人，待人温暖","缺少条理，容易粗心","冷静，情绪稳定","循规蹈矩，缺少创造性"],options:["非常不同意","不同意","略不同意","中立","略同意","同意","非常同意"],analyze(a){
      const dims=["外向性","宜人性","尽责性","情绪稳定性","经验开放性"];
      const pairs=[[0,5],[6,1],[2,7],[8,3],[4,9]];
      const values=pairs.map(([pos,neg]) => (a[pos]+1+7-a[neg])/2);
      return {score:"5 个维度",title:"你的大五人格自评轮廓",text:dims.map((d,i)=>d+" "+values[i].toFixed(1)+" / 7").join("；")+"。分数较高表示你更认同该维度的描述。",tip:"每个维度只有两题，结果较粗略。选一个最符合与你最不符合的描述，分别想想它通常在哪些场合出现。"};
    }},
    {name:"自尊量表 · RSES",category:"人格探索",desc:"看看你如何评价自己的价值、能力以及对自己的整体态度。",source:"Rosenberg (1965)，本站据英文版译写",url:"https://socy.umd.edu/about-us/using-rosenberg-self-esteem-scale",period:"考虑你通常对自己的感受，选择对下列说法的认同程度。",questions:["总体上，我对自己感到满意","有时我觉得自己一无是处","我觉得自己有不少优点","我做事能和大多数人做得一样好","我觉得自己没有什么值得骄傲的地方","有时我确实觉得自己没有用","我觉得自己是个有价值的人，至少与别人同等有价值","我希望自己能更加尊重自己","总体而言，我倾向于觉得自己是个失败者","我对自己持肯定的态度"],options:["非常不同意","不同意","同意","非常同意"],analyze(a){
      const rev=[1,4,5,7,8];
      const values=a.map((n,i)=>rev.includes(i)?3-n:n);
      const affirm=values.filter(n=>n>=2).length;
      return {score:total(values)+" / 30",title:"你对自己的整体评价",text:"在 10 项描述中，你的选择有 "+affirm+" 项偏向肯定自己。总分越高，表示回答中对自身价值的认可越多。",tip:"回忆一件最近让你对自己满意的具体小事，再想想遇到挫折时你通常怎样评价自己。两种情境的差别可能比单次总分更有启发。"};
    }},
    brief("抑郁两题初筛 · PHQ-2","快速回顾近期兴趣与情绪变化。",phq.slice(0,2),phqURL,"PHQ-9"),
    brief("焦虑两题初筛 · GAD-2","快速回顾紧张感与控制担忧的难度。",gad.slice(0,2),gadURL,"GAD-7")
  ];
})();
