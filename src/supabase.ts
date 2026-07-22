import { createClient } from '@supabase/supabase-js';
import { 
  ServiceRequest, 
  ProductItem, 
  SalesOrder, 
  SystemLog, 
  BusinessRegistration,
  UserProfile
} from './types';

// Retrieve credentials safely from client environment
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Normalizes snake_case database schema fields back to React camelCase styles.
 */
export async function fetchBusinessesFromSupabase(): Promise<BusinessRegistration[] | null> {
  if (!supabase) return null;
  try {
    const { data: dbBiz, error: bizError } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (bizError) throw bizError;
    if (!dbBiz) return [];

    // Fetch associated services in bulk
    const { data: dbServices, error: srvError } = await supabase
      .from('business_services')
      .select('*');

    if (srvError) throw srvError;

    return dbBiz.map(b => {
      const relatedServices = dbServices
        ?.filter(s => s.business_id === b.id)
        ?.map(s => ({
          name: s.name,
          price: Number(s.price),
          description: s.description || ''
        })) || [];

      return {
        id: b.id,
        name: b.name,
        logo: b.logo || '',
        address: b.address,
        mapLink: b.map_link || '',
        telephones: b.telephones || '',
        whatsapp: b.whatsapp || '',
        ownerName: b.owner_name,
        giro: b.giro,
        status: b.status as 'Activo' | 'Suspendido' | 'Desactivado',
        services: relatedServices,
        createdAt: b.created_at || new Date().toISOString()
      };
    });
  } catch (e) {
    console.error('Supabase fetch error [businesses]:', e);
    return null;
  }
}

export async function fetchServicesFromSupabase(): Promise<ServiceRequest[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('scheduled_date', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map(s => ({
      id: s.id,
      clientName: s.client_name,
      clientEmail: s.client_email,
      serviceType: s.service_type,
      date: s.scheduled_date,
      address: s.address,
      price: Number(s.price),
      status: s.status as any,
      assignedStaff: s.assigned_staff || 'Por Asignar',
      priority: s.priority as any,
      notes: s.notes || '',
      uploadedPhoto: s.uploaded_photo || undefined,
      selectedItems: s.selected_items || []
    }));
  } catch (e) {
    console.error('Supabase fetch error [services]:', e);
    return null;
  }
}

export async function fetchProductsFromSupabase(): Promise<ProductItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(p => {
      // Map CAT-01/02 back to friendly names
      let categoryName = 'Ferretería';
      if (p.category_id === 'CAT-01') categoryName = 'Zapatos';
      else if (p.category_id === 'CAT-02') categoryName = 'Productos de limpieza';
      else if (p.category_id === 'CAT-03') categoryName = 'Seguridad';
      else if (p.category_id === 'CAT-04') categoryName = 'Hogar';
      else if (p.category_id === 'CAT-05') categoryName = 'Herramientas';

      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: categoryName,
        price: Number(p.price),
        stock: Number(p.stock),
        salesCount: Number(p.sales_count || 0),
        description: p.description || '',
        imageUrl: p.image_url || '',
        glbUrl: p.ar_model_glb || '',
        usdzUrl: p.ar_model_usdz || '',
        active: true
      };
    });
  } catch (e) {
    console.error('Supabase fetch error [products]:', e);
    return null;
  }
}

export async function fetchOrdersFromSupabase(): Promise<SalesOrder[] | null> {
  if (!supabase) return null;
  try {
    const { data: dbOrders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderError) throw orderError;
    if (!dbOrders) return [];

    const { data: dbItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*');

    if (itemsError) throw itemsError;

    return dbOrders.map(o => {
      const items = dbItems?.filter(i => i.order_id === o.id) || [];
      const productNames = items.map(i => i.product_name_fallback);

      return {
        id: o.id,
        customerName: o.customer_name,
        customerEmail: o.customer_email,
        date: o.created_at || new Date().toISOString(),
        total: Number(o.total_amount),
        status: o.status as any,
        itemsCount: Number(o.items_count || items.length || 1),
        productNames: productNames.length > 0 ? productNames : ['Artículos Varios']
      };
    });
  } catch (e) {
    console.error('Supabase fetch error [orders]:', e);
    return null;
  }
}

export async function fetchAuditLogsFromSupabase(): Promise<SystemLog[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    if (!data) return [];

    return data.map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      actor: l.actor,
      role: l.role as any,
      action: l.action,
      severity: l.severity as any
    }));
  } catch (e) {
    console.error('Supabase fetch error [audit_logs]:', e);
    return null;
  }
}

/**
 * Fetches user profiles from Supabase.
 */
export async function fetchProfilesFromSupabase(): Promise<UserProfile[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as any,
      status: u.status as any,
      lastActive: u.last_active || 'Hace un momento'
    }));
  } catch (e) {
    console.error('Supabase fetch error [users]:', e);
    return null;
  }
}

/**
 * Saves or updates a user profile to Supabase.
 */
export async function saveProfileToSupabase(profile: UserProfile, password?: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload: any = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      last_active: new Date().toISOString()
    };

    if (password) {
      payload.password = password;
    }

    const { error } = await supabase.from('users').upsert(payload);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Supabase save error [user]:', e);
    return false;
  }
}

/**
 * Saves and registers any business profile / sponsor with its subservices to Supabase.
 */
export async function saveBusinessToSupabase(biz: BusinessRegistration): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error: bizError } = await supabase.from('businesses').upsert({
      id: biz.id,
      name: biz.name,
      logo: biz.logo,
      address: biz.address,
      map_link: biz.mapLink,
      telephones: biz.telephones,
      whatsapp: biz.whatsapp,
      owner_name: biz.ownerName,
      giro: biz.giro,
      status: biz.status === 'Desactivado' ? 'Suspendido' : biz.status,
      created_at: biz.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (bizError) throw bizError;

    // Delete existing subservices associated with the business
    await supabase.from('business_services').delete().eq('business_id', biz.id);

    // Insert new subservices in bulk
    if (biz.services && biz.services.length > 0) {
      const servicesToInsert = biz.services.map(s => ({
        business_id: biz.id,
        name: s.name,
        price: s.price,
        description: s.description
      }));
      const { error: srvError } = await supabase.from('business_services').insert(servicesToInsert);
      if (srvError) throw srvError;
    }
    return true;
  } catch (e) {
    console.error('Supabase save error [business]:', e);
    return false;
  }
}

export async function deleteBusinessFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('businesses').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Supabase deletion error [business]:', e);
    return false;
  }
}

/**
 * Saves a service scheduling request to Supabase.
 */
export async function saveServiceToSupabase(srv: ServiceRequest): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('services').upsert({
      id: srv.id,
      client_name: srv.clientName,
      client_email: srv.clientEmail,
      service_type: srv.serviceType,
      scheduled_date: srv.date || new Date().toISOString(),
      address: srv.address,
      price: srv.price,
      status: srv.status,
      assigned_staff: srv.assignedStaff || 'Por Asignar',
      priority: srv.priority,
      notes: srv.notes || '',
      created_at: srv.date || new Date().toISOString()
    });

    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Supabase save error [service]:', e);
    return false;
  }
}

/**
 * Saves an e-commerce catalog product into Supabase.
 */
export async function saveProductToSupabase(prod: ProductItem): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Map friendly text categorization back to static categories seeded in Database
    let catId = 'CAT-01'; // Default: Zapatos
    const catLower = (prod.category || '').toLowerCase();
    if (catLower.includes('zap')) catId = 'CAT-01';
    else if (catLower.includes('limp')) catId = 'CAT-02';
    else if (catLower.includes('seg')) catId = 'CAT-03';
    else if (catLower.includes('hog')) catId = 'CAT-04';
    else if (catLower.includes('her') || catLower.includes('tool')) catId = 'CAT-05';

    const { error } = await supabase.from('products').upsert({
      id: prod.id,
      name: prod.name,
      sku: prod.sku,
      category_id: catId,
      price: prod.price,
      stock: prod.stock,
      sales_count: prod.salesCount || 0,
      description: prod.description || '',
      image_url: prod.imageUrl || '',
      ar_model_glb: prod.glbUrl || '',
      ar_model_usdz: prod.usdzUrl || '',
      updated_at: new Date().toISOString()
    });

    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Supabase save error [product]:', e);
    return false;
  }
}

export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Supabase deletion error [product]:', e);
    return false;
  }
}

/**
 * Saves an e-commerce checkout sales order with item fallbacks to Supabase.
 */
export async function saveOrderToSupabase(order: SalesOrder): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error: orderError } = await supabase.from('orders').upsert({
      id: order.id,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      total_amount: order.total,
      status: order.status,
      items_count: order.itemsCount || order.productNames?.length || 1,
      created_at: order.date || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (orderError) throw orderError;

    // Delete existing order items mapping
    await supabase.from('order_items').delete().eq('order_id', order.id);

    // Re-insert detailed intermediate maps
    if (order.productNames && order.productNames.length > 0) {
      const itemsToInsert = order.productNames.map(name => ({
        order_id: order.id,
        product_name_fallback: name,
        quantity: 1,
        unit_price: Number((order.total / order.productNames.length).toFixed(2))
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;
    }
    return true;
  } catch (e) {
    console.error('Supabase save error [order]:', e);
    return false;
  }
}

/**
 * Saves a system workspace audit logs to Supabase audit_logs DB.
 */
export async function saveAuditLogToSupabase(log: SystemLog): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('audit_logs').upsert({
      id: log.id,
      timestamp: log.timestamp || new Date().toISOString(),
      actor: log.actor || 'Sistema',
      role: log.role || 'Administrador',
      action: log.action,
      severity: log.severity || 'info'
    });

    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Supabase save error [audit_log]:', e);
    return false;
  }
}
