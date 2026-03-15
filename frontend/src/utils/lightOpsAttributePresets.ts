import type { CreateUserAttributeRequest, UserAttributeDefinition } from '@/types'

export const LIGHT_OPS_ATTRIBUTE_PRESETS: CreateUserAttributeRequest[] = [
  {
    key: 'customer_type',
    name: '客户类型',
    description: '用于区分朋友、转发、自营等客户来源',
    type: 'select',
    options: [
      { value: 'friend', label: '朋友' },
      { value: 'forward', label: '转发' },
      { value: 'self_operated', label: '自营' }
    ],
    placeholder: '请选择客户类型',
    enabled: true
  },
  {
    key: 'customer_status',
    name: '客户状态',
    description: '用于标记当前跟进状态，便于后续续费和管理',
    type: 'select',
    options: [
      { value: 'trial', label: '试用' },
      { value: 'active', label: '正常' },
      { value: 'pending_renewal', label: '待续费' },
      { value: 'disabled', label: '停用' }
    ],
    placeholder: '请选择客户状态',
    enabled: true
  },
  {
    key: 'payment_channel',
    name: '收款渠道',
    description: '记录客户通常通过什么渠道付款',
    type: 'select',
    options: [
      { value: 'wechat', label: '微信' },
      { value: 'alipay', label: '支付宝' },
      { value: 'xianyu', label: '咸鱼' },
      { value: 'other', label: '其他' }
    ],
    placeholder: '请选择收款渠道',
    enabled: true
  },
  {
    key: 'contact_remark',
    name: '联系人备注',
    description: '记录微信名、昵称或你方便记忆的联系人信息',
    type: 'text',
    placeholder: '例如：微信老张 / 咸鱼小王',
    enabled: true
  },
  {
    key: 'payment_note',
    name: '支付备注',
    description: '记录转账截图、订单号、金额等支付信息',
    type: 'textarea',
    placeholder: '例如：2026-03-15 微信转账 200 元，备注 Claude Max',
    enabled: true
  },
  {
    key: 'ops_note',
    name: '运营备注',
    description: '记录运营判断、风险提醒、补偿情况等内部信息',
    type: 'textarea',
    placeholder: '例如：先走共享组，月底视情况切专属 key',
    enabled: true
  }
]

export const LIGHT_OPS_QUICK_FILTER_KEYS = ['customer_type', 'customer_status'] as const

export function getMissingLightOpsAttributePresets(
  definitions: Pick<UserAttributeDefinition, 'key'>[]
): CreateUserAttributeRequest[] {
  const existingKeys = new Set(definitions.map((definition) => definition.key))
  return LIGHT_OPS_ATTRIBUTE_PRESETS.filter((preset) => !existingKeys.has(preset.key))
}

export function findAttributeDefinitionByKey(
  definitions: UserAttributeDefinition[],
  key: string
): UserAttributeDefinition | undefined {
  return definitions.find((definition) => definition.key === key)
}
