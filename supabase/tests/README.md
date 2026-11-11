# Validación requerida antes de habilitar escrituras

La migración es un diseño sin ejecutar. Realizar estas pruebas con fixtures ficticios en una base de desarrollo descartable. Nunca usar service_role o SQL Editor como evidencia de que RLS funciona: ambos pueden omitir RLS.

1. Crear tenants A/B, usuarios owner A, owner B, barber A, usuario sin membresía y membresía inactiva. Crear datos para ambos tenants mediante sesión administrativa.
2. Usar JWT reales y clave publicable con el cliente Supabase: anon y usuario sin membresía no leen datos; cada owner solo lee su tenant; usuario inactivo no lee datos operacionales.
3. Probar SELECT, INSERT, UPDATE y DELETE de cada tabla para cada rol. Todas las escrituras API deben fallar en este borrador; platform_admins no es accesible por API.
4. Barber A solo lee su ficha y agenda; no lee clientes, auditoría ni agenda de otro barbero. Verificar que conocer UUID de B no permite leer filas.
5. Con conexión administrativa, insertar una reserva con cliente/servicio/barbero de otro tenant: debe fallar FK compuesta.
6. En dos transacciones concurrentes, insertar intervalos superpuestos del mismo barbero: solo uno confirma. Bloqueo versus reserva también debe fallar. Intervalos adyacentes, distintos barberos o reserva cancelada deben permitirse.
7. Confirmar que no se puede editar la membresía propia ni autoasignarse platform_admin.

Guardar resultados reproducibles y convertir esta matriz a pruebas SQL/API automatizadas en Etapa 1. Todavía faltan RPC transaccionales de escritura con auditoría, comprobación de tenant activo y permisos. No conectar operaciones de producción a este borrador.
