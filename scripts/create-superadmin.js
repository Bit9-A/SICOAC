import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Parsear el archivo .env manualmente
const envPath = path.resolve(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.error('Error: No se encontró el archivo .env en la raíz del proyecto.')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf-8')
const env = {}
envContent.split(/\r?\n/).forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    let val = valueParts.join('=').trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
    env[key.trim()] = val
  }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const serviceRoleKey = env.SERVICE_ROLE

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: VITE_SUPABASE_URL o SERVICE_ROLE no están definidos en el archivo .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Leer argumentos
const args = process.argv.slice(2)
if (args.length < 5) {
  console.log('\nUso:')
  console.log('  node scripts/create-superadmin.js <email> <password> <username> <nombre> <apellido> [telefono]\n')
  console.log('Ejemplo:')
  console.log('  node scripts/create-superadmin.js admin@sicoac.com admin123 superadmin "Juan" "Pérez" "04121234567"\n')
  process.exit(1)
}

const [email, password, username, nombre, apellido, telefono = ''] = args

async function run() {
  console.log(`Creando super_admin con email: ${email}...`)
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username,
      nombre,
      apellido,
      telefono,
      rol: 'super_admin'
    }
  })

  if (error) {
    console.error('Error al crear el super_admin:', error.message)
    process.exit(1)
  }

  console.log('¡Superadmin creado exitosamente!')
  console.log('ID del usuario:', data.user.id)
  console.log('Datos del perfil creado:')
  console.log(`- Username: ${username}`)
  console.log(`- Nombre completo: ${nombre} ${apellido}`)
  console.log('- Rol: super_admin')
}

run()
