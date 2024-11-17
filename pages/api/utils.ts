// utils/typeCheck.ts
type ExpectedType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null'

interface FieldDefinition {
  key: string
  type: ExpectedType
  required?: boolean
}

const validateFields = (data: Record<string, any>, fields: FieldDefinition[]): boolean => {
  for (const field of fields) {
    const { key, type, required } = field
    const value = data[key]

    if (required && (value === undefined || value === null)) {
      return false // 必須のフィールドがない場合
    }

    if (value !== undefined && value !== null) {
      if (type === 'array' && !Array.isArray(value)) {
        return false // 型がarrayだが、値が配列でない場合
      } else if (type !== 'array' && typeof value !== type) {
        return false // 指定された型と一致しない場合
      }
    }
  }
  return true
}

const createQueryString = (data: Record<string, any>) => {
  return Object.keys(data)
    .filter((key) => data[key] !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

export { validateFields, createQueryString }
