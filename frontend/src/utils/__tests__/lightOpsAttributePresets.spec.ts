import { describe, expect, it } from 'vitest'
import {
  LIGHT_OPS_ATTRIBUTE_PRESETS,
  findAttributeDefinitionByKey,
  getMissingLightOpsAttributePresets
} from '@/utils/lightOpsAttributePresets'

describe('lightOpsAttributePresets', () => {
  it('能找出缺失的轻运营字段预设', () => {
    const missing = getMissingLightOpsAttributePresets([
      { key: 'customer_type' },
      { key: 'payment_channel' }
    ])

    expect(missing.map((item) => item.key)).toEqual([
      'customer_status',
      'contact_remark',
      'payment_note',
      'ops_note'
    ])
  })

  it('按 key 查找字段定义', () => {
    const match = findAttributeDefinitionByKey(
      LIGHT_OPS_ATTRIBUTE_PRESETS.map((preset, index) => ({
        id: index + 1,
        key: preset.key,
        name: preset.name,
        description: preset.description || '',
        type: preset.type,
        options: preset.options || [],
        required: false,
        validation: {},
        placeholder: preset.placeholder || '',
        display_order: index,
        enabled: true,
        created_at: '',
        updated_at: ''
      })),
      'ops_note'
    )

    expect(match?.name).toBe('运营备注')
  })
})
