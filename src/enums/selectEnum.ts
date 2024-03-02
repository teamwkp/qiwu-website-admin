export enum LangEnum {
  zh = '中文',
  en = '英文',
}

export const RuleRequireInputFalse = {
  required: false,
  message: '请输入',
};
export const RuleRequireInputTrue = {
  required: true,
  message: '请输入',
};

export const NavStatusList = [
  { label: '显示', value: 1 },
  { label: '隐藏', value: 0 },
];

export const MultilingualConfigTypeList = [
  { label: '单行字符串', value: 1 },
  { label: '富文本', value: 2 },
  { label: '图片', value: 3 },
  { label: '视频', value: 4 },
  { label: '链接', value: 5 },
];

export const MultilingualConfigTypeDict = {
  1: { name: '单行字符串', type: 1 },
  2: { name: '富文本', type: 2 },
  3: { name: '图片', type: 3 },
  4: { name: '视频', type: 4 },
  5: { name: '链接', type: 5 },
};

export const ProductCategoryNavStatusDict = {
  0: { name: '隐藏', type: 2 },
  1: { name: '显示', type: 1 },
};

export const ProductCategoryNavStatusList = [
  { label: '隐藏', value: 0 },
  { label: '显示', value: 1 },
];

export const MultilingualConfigLangZhList = [
  {
    lang: 'zh',
    name: '简中',
    key: 'configValueZh',
  },
];

export const MultilingualConfigLangList = [
  {
    lang: 'zh',
    name: '简中',
    key: 'configValueZh',
  },
  {
    lang: 'en',
    name: '英文',
    key: 'configValueEn',
  },
  {
    lang: 'ja',
    name: '日语',
    key: 'configValueJa',
  },
  {
    lang: 'ko',
    name: '韩语',
    key: 'configValueKo',
  },
  {
    lang: 'es',
    name: '西语',
    key: 'configValueEs',
  },
  {
    lang: 'pt',
    name: '葡语',
    key: 'configValuePt',
  },
  {
    lang: 'ru',
    name: '俄语',
    key: 'configValueRu',
  },
  {
    lang: 'fr',
    name: '法语',
    key: 'configValueFr',
  },
  {
    lang: 'pl',
    name: '波兰语',
    key: 'configValuePl',
  },
  {
    lang: 'de',
    name: '德语',
    key: 'configValueDe',
  },
  {
    lang: 'it',
    name: '意语',
    key: 'configValueIt',
  },
];

export const ProductMainRecommendDict = {
  0: { name: '否', type: 2 },
  1: { name: '是', type: 1 },
};

export const ProductMainRecommendList = [
  { label: '否', value: 0 },
  { label: '是', value: 1 },
];

export const ProductPublishStatusDict = {
  0: { name: '下架', type: 2 },
  1: { name: '上架', type: 1 },
};

export const ProductPublishStatusList = [
  { label: '下架', value: 0 },
  { label: '上架', value: 1 },
];
