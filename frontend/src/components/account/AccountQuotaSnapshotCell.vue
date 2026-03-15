<template>
  <div>
    <div v-if="loading && !hasRenderableContent" class="space-y-1">
      <div class="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>

    <div v-else-if="error && !hasRenderableContent" class="text-xs text-red-500">
      {{ error }}
    </div>

    <div v-else-if="hasRenderableContent" class="space-y-1 text-xs">
      <div
        v-if="categoryLabel"
        class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-dark-700 dark:text-gray-300"
      >
        {{ categoryLabel }}
      </div>

      <div v-if="todayCostText" class="flex items-center gap-1">
        <span class="text-gray-500 dark:text-gray-400">{{ t('admin.accounts.quotaSnapshot.today') }}:</span>
        <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ todayCostText }}</span>
      </div>

      <div v-if="windowCostText" class="flex items-center gap-1">
        <span class="text-gray-500 dark:text-gray-400">{{ t('admin.accounts.quotaSnapshot.window5h') }}:</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ windowCostText }}</span>
      </div>

      <div v-if="totalQuotaText" class="flex items-center gap-1">
        <span class="text-gray-500 dark:text-gray-400">{{ t('admin.accounts.quotaSnapshot.total') }}:</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ totalQuotaText }}</span>
      </div>

      <div v-if="dailyQuotaText" class="flex items-center gap-1">
        <span class="text-gray-500 dark:text-gray-400">{{ t('admin.accounts.quotaSnapshot.daily') }}:</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ dailyQuotaText }}</span>
      </div>

      <div v-if="weeklyQuotaText" class="flex items-center gap-1">
        <span class="text-gray-500 dark:text-gray-400">{{ t('admin.accounts.quotaSnapshot.weekly') }}:</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ weeklyQuotaText }}</span>
      </div>
    </div>

    <div v-else class="text-xs text-gray-400">-</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Account, WindowStats } from '@/types'
import { formatCurrency } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    account: Account
    stats?: WindowStats | null
    loading?: boolean
    error?: string | null
  }>(),
  {
    stats: null,
    loading: false,
    error: null
  }
)

const { t } = useI18n()

const isThirdPartyKeyAccount = computed(() =>
  ['apikey', 'upstream', 'bedrock'].includes(props.account.type)
)

const isWindowCostAccount = computed(
  () =>
    props.account.platform === 'anthropic' &&
    (props.account.type === 'oauth' || props.account.type === 'setup-token')
)

const categoryLabel = computed(() => {
  if (isThirdPartyKeyAccount.value) {
    return t('admin.accounts.quotaSnapshot.categories.thirdPartyKey')
  }
  if (isWindowCostAccount.value) {
    return t('admin.accounts.quotaSnapshot.categories.sharedAccount')
  }
  if (props.stats) {
    return t('admin.accounts.quotaSnapshot.categories.accountUsage')
  }
  return ''
})

const todayCostText = computed(() => {
  if (!props.stats) return ''
  return formatCurrency(props.stats.cost ?? 0)
})

const windowCostText = computed(() => {
  if (!isWindowCostAccount.value) return ''
  const current = props.account.current_window_cost
  const limit = props.account.window_cost_limit
  if (current == null && limit == null) return ''
  if (limit != null && limit > 0) {
    return `${formatCurrency(current ?? 0)} / ${formatCurrency(limit)}`
  }
  return formatCurrency(current ?? 0)
})

const totalQuotaText = computed(() => {
  if (!isThirdPartyKeyAccount.value) return ''
  const used = props.account.quota_used ?? 0
  const limit = props.account.quota_limit
  if (limit != null && limit > 0) {
    return `${formatCurrency(used)} / ${formatCurrency(limit)}`
  }
  return formatCurrency(used)
})

const dailyQuotaText = computed(() => {
  if (!isThirdPartyKeyAccount.value) return ''
  const limit = props.account.quota_daily_limit
  const used = props.account.quota_daily_used ?? 0
  if (limit != null && limit > 0) {
    return `${formatCurrency(used)} / ${formatCurrency(limit)}`
  }
  return ''
})

const weeklyQuotaText = computed(() => {
  if (!isThirdPartyKeyAccount.value) return ''
  const limit = props.account.quota_weekly_limit
  const used = props.account.quota_weekly_used ?? 0
  if (limit != null && limit > 0) {
    return `${formatCurrency(used)} / ${formatCurrency(limit)}`
  }
  return ''
})

const hasRenderableContent = computed(
  () =>
    Boolean(todayCostText.value) ||
    Boolean(windowCostText.value) ||
    Boolean(totalQuotaText.value) ||
    Boolean(dailyQuotaText.value) ||
    Boolean(weeklyQuotaText.value)
)
</script>
