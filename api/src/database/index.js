const db = {
  categories: [
    { id: 1, name: '方太', description: '方太集团创建于1996年，专注于高端厨房电器的研发和制造', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: '奥普', description: '奥普电器始创于1993年，专业生产浴霸、集成吊顶等产品', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: '林内', description: '林内成立于1920年，是全球领先的燃气具制造企业', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, name: '史密斯', description: 'A.O.史密斯创立于1874年，专注于热水器、净水设备', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 5, name: '老板', description: '老板电器创立于1979年，中国厨房电器领导品牌', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 6, name: '海尔', description: '海尔集团创立于1984年，全球领先的家电品牌', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 7, name: '创维', description: '创维集团成立于1988年，专业从事智能家电研发', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 8, name: '格力', description: '格力电器成立于1991年，全球最大的空调制造商', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 9, name: '美的', description: '美的集团成立于1968年，全球领先的家电企业', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  products: [
    {
      id: 1,
      categoryId: 2,
      name: '奥普浴霸LTO1E',
      price: 2999,
      description: '智能恒温浴霸，集成照明、换气、取暖功能于一体，为您打造舒适的浴室体验。',
      images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bathroom%20heater%20ceiling%20mounted%20white%20modern&image_size=square'],
      specs: '功率: 2600W\n照明: 24W\n换气: 120m3/h\n尺寸: 300x600mm',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      categoryId: 2,
      name: '奥普浴霸LTO2E',
      price: 3999,
      description: '高端智能浴霸，支持语音控制，一键开启舒适模式。',
      images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20bathroom%20heater%20with%20voice%20control%20modern%20design&image_size=square'],
      specs: '功率: 3000W\n照明: 36W\n换气: 150m3/h\n尺寸: 300x600mm\n语音控制: 支持',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      categoryId: 6,
      name: '海尔冰箱BCD-500',
      price: 4599,
      description: '500升大容量变频冰箱，风冷无霜，智能控温。',
      images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20refrigerator%20stainless%20steel%20large%20capacity&image_size=square'],
      specs: '容量: 500L\n能效等级: 一级\n制冷方式: 风冷\n控温方式: 电脑控温',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      categoryId: 8,
      name: '格力空调KFR-72',
      price: 5999,
      description: '3匹变频冷暖空调，节能静音，快速制冷制热。',
      images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20air%20conditioner%20split%20system%20white&image_size=square'],
      specs: '匹数: 3匹\n能效等级: 一级\n变频: 是\n制冷量: 7200W',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  admin: [
    { id: 1, username: 'admin', password: '$2a$10$rN2ZpZ3yG4hH5jJ6kK7lM8nN9oO0pP1qR2sT3uU4vV5wW6xX7yY8z', createdAt: new Date().toISOString() },
  ],
}

let categoryIdCounter = 10
let productIdCounter = 5

module.exports = { db, categoryIdCounter, productIdCounter }
