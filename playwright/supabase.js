/**
 * supabase.js
 * Cliente Supabase + helper de login para los scripts de automatización.
 * 
 * Uso:
 *   const { supabase, login } = require('../supabase');
 *   const session = await login('usuario@email.com', 'contraseña');
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl  = process.env.SUPABASE_URL;
const supabaseKey  = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Faltan SUPABASE_URL o SUPABASE_ANON_KEY en el archivo .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Inicia sesión con email y contraseña.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('@supabase/supabase-js').Session>}
 */
async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(`❌ Login Supabase fallido: ${error.message}`);
  }
  console.log(`✅ Sesión Supabase iniciada para ${data.user.email}`);
  return data.session;
}

/**
 * Cierra la sesión actual.
 */
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.warn('⚠️  Error al cerrar sesión:', error.message);
  else console.log('🚪 Sesión Supabase cerrada.');
}

module.exports = { supabase, login, logout };
