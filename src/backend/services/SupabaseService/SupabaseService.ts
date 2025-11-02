import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { envConfig } from '@/backend/config'

/**
 * Supabase Service
 * Provides a singleton Supabase client instance for server-side operations.
 * Uses the `service_role` key for full access in API routes.
 */
export class SupabaseService {
  private static instance: SupabaseClient | null = null

  /**
   * Get the Supabase client instance.
   * Initializes it if not already created.
   */
  public static getClient(): SupabaseClient {
    if (!SupabaseService.instance) {
      const supabaseUrl = envConfig.supabaseUrl
      const supabaseServiceKey = envConfig.supabaseServiceKey

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error(
          'Supabase URL or Service Key is not configured in environment variables.'
        )
      }

      SupabaseService.instance = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false, // No session persistence on server-side
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    }
    return SupabaseService.instance
  }

  /**
   * Fetch all data from a table
   */
  public static async fetchAll<T>(tableName: string): Promise<T[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase.from(tableName).select('*')

    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error)
      throw new Error(`Failed to fetch data: ${error.message}`)
    }

    return (data || []) as T[]
  }

  /**
   * Fetch a single record by ID
   */
  public static async fetchById<T>(
    tableName: string,
    id: string | number
  ): Promise<T | null> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error(`Error fetching ${tableName} by ID:`, error)
      throw new Error(`Failed to fetch data: ${error.message}`)
    }

    return data as T
  }

  /**
   * Insert a new record
   */
  public static async insert<T>(
    tableName: string,
    data: Partial<T>
  ): Promise<T> {
    const supabase = this.getClient()
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error(`Error inserting into ${tableName}:`, error)
      throw new Error(`Failed to insert data: ${error.message}`)
    }

    return insertedData as T
  }

  /**
   * Update a record by ID
   */
  public static async update<T>(
    tableName: string,
    id: string | number,
    data: Partial<T>
  ): Promise<T> {
    const supabase = this.getClient()
    const { data: updatedData, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating ${tableName}:`, error)
      throw new Error(`Failed to update data: ${error.message}`)
    }

    return updatedData as T
  }

  /**
   * Delete a record by ID
   */
  public static async delete(
    tableName: string,
    id: string | number
  ): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) {
      console.error(`Error deleting from ${tableName}:`, error)
      throw new Error(`Failed to delete data: ${error.message}`)
    }
  }

  /**
   * Execute a custom query
   * @param tableName - The table name
   * @param queryBuilder - A function that builds the query
   */
  public static async query<T>(
    tableName: string,
    queryBuilder: (query: ReturnType<SupabaseClient['from']>) => ReturnType<SupabaseClient['from']>
  ): Promise<T[]> {
    const supabase = this.getClient()
    const query = supabase.from(tableName).select('*')
    const builtQuery = queryBuilder(query)
    const { data, error } = await builtQuery

    if (error) {
      console.error(`Error querying ${tableName}:`, error)
      throw new Error(`Failed to query data: ${error.message}`)
    }

    return (data || []) as T[]
  }

  /**
   * Check if Supabase is configured
   */
  public static isConfigured(): boolean {
    return !!(
      envConfig.supabaseUrl && envConfig.supabaseServiceKey
    )
  }
}

