# WhatsApp Cloud API: preparación futura

No hay conexión real ni endpoints en Etapa 0. No es necesario configurar Meta para probar la pantalla inicial. Estos son los requisitos de la Etapa 4; los nombres exactos de pantallas y versiones deberán verificarse entonces en documentación oficial.

1. Crear manualmente aplicación de Meta Developers con producto WhatsApp y número de prueba.
2. Agregar y verificar destinatarios de prueba autorizados en Meta.
3. Obtener token de prueba, Phone Number ID y secreto de aplicación. Configurarlos solo en .env.local: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID y META_APP_SECRET.
   Conserva también WABA ID (WhatsApp Business Account ID) para revisar suscripciones. Phone Number ID no es el número visible. No pegues tokens ni App Secret en el chat.
4. Seleccionar una versión Graph API soportada al conectar y completar WHATSAPP_GRAPH_API_VERSION. No fijamos una versión sin verificar su vigencia.
5. Crear un secreto propio WHATSAPP_VERIFY_TOKEN. No confundir con access token o app secret.
6. Una vez implementado, exponer endpoint HTTPS de desarrollo y configurar webhook GET/POST. GET compara verify token y retorna challenge. POST valida X-Hub-Signature-256 con HMAC SHA-256 sobre bytes crudos antes de interpretar JSON.
7. Suscribir eventos de mensajes. Resolver tenant por Phone Number ID en servidor, deduplicar por identificador de evento/mensaje, persistir antes de responder y enviar a procesamiento durable.
8. Probar envío/recepción, firma inválida, evento repetido, tenant pausado, vencimiento de token y reintentos sin duplicar reservas o mensajes.

Primero construiremos simulador local determinístico, sin créditos. El agente y el simulador compartirán los servicios de negocio. No usaremos automatización de WhatsApp Web. Recordatorios fuera de ventana requerirán plantillas y reglas oficiales vigentes; validar en su etapa. No registrar tokens ni cuerpos completos con datos personales.

No necesitas comprar un número ni desplegar ahora. Cuando exista el endpoint configuraremos URL HTTPS, verify token y suscripción a `messages`; probaremos mensajes entrantes reales además del botón de pruebas.

Referencia: https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started (requiere login durante esta revisión; verificar nombres de pantallas en tu cuenta).
