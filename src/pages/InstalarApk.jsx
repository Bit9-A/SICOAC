import { Download, ShieldAlert, Camera, ArrowLeft, Smartphone, Settings, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function InstalarApk() {
  const steps = [
    {
      icon: <Download className="w-6 h-6 text-primary" />,
      title: "1. Descargar el archivo APK",
      desc: "Haz clic en el botón de descarga para bajar el archivo 'SICOAC.apk' a tu dispositivo Android."
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      title: "2. Permitir fuentes desconocidas",
      desc: "Al abrir el archivo, es posible que Android te advierta que bloquea la instalación. Ve a Configuración en el mensaje emergente y activa 'Permitir desde esta fuente' (o 'Orígenes desconocidos')."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-primary" />,
      title: "3. Instalar la aplicación",
      desc: "Regresa al instalador y presiona 'Instalar'. Si Google Play Protect muestra una advertencia indicando que se bloqueó la aplicación para proteger tu dispositivo, presiona en 'Más detalles' y luego selecciona 'Instalar de todas formas'."
    },
    {
      icon: <Camera className="w-6 h-6 text-primary" />,
      title: "4. Permisos necesarios (Cámara)",
      desc: "Al abrir la app y usar la función de escaneo por primera vez, el sistema te solicitará permiso para acceder a la cámara. Debes pulsar en 'Permitir' para que el escáner de códigos de barra funcione correctamente."
    }
  ]

  const handleDownload = () => {
    fetch('/SICOAC.apk')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(
          new Blob([blob], { type: 'application/vnd.android.package-archive' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'SICOAC.apk');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        const link = document.createElement('a');
        link.href = '/SICOAC.apk';
        link.setAttribute('download', 'SICOAC.apk');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  const handleBack = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-dvh bg-background px-4 py-8 md:py-12 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* Botón Volver */}
        <div>
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Button>
        </div>

        {/* Encabezado */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-14 rounded-2xl bg-primary/10 mb-2">
            <img src="/logo_sicoac.png" alt="Logo SICOAC" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Instalación de SICOAC</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Sigue estos sencillos pasos para instalar la aplicación móvil y configurarla en tu dispositivo Android.
          </p>
        </div>

        {/* Botón Descarga Principal */}
        <Card className="p-6 border-primary/20 bg-primary/5 text-center space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-primary flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5" /> Aplicación SICOAC Móvil
            </h3>
            <p className="text-xs text-muted-foreground">Versión oficial para dispositivos Android (.apk)</p>
          </div>
          
          <Button 
            onClick={handleDownload}
            size="lg" 
            className="w-full sm:w-auto gap-2 px-8 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Download className="w-5 h-5" />
            Descargar SICOAC.apk
          </Button>
        </Card>

        {/* Compatibilidad Warning */}
        <Card className="p-4 border-destructive/20 bg-destructive/5 flex gap-3 items-start">
          <Info className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-sm font-semibold text-destructive">Compatibilidad del sistema</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Esta aplicación móvil está en formato APK y está diseñada <strong>exclusivamente para dispositivos Android</strong>. No es compatible y <strong>no funcionará en dispositivos Apple (iPhone o iPad)</strong>.
            </p>
          </div>
        </Card>

        {/* Pasos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Guía paso a paso</h2>
          
          <div className="grid gap-4">
            {steps.map((step, idx) => (
              <Card key={idx} className="p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Advertencias/Notas */}
        <Card className="p-4 border-amber-500/20 bg-amber-500/5 flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-sm font-semibold text-amber-700 dark:text-amber-400">Nota de Seguridad</h5>
            <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
              Esta aplicación está diseñada específicamente para el uso interno de la red de Centros de Acopio. Es completamente segura y no recopila datos personales más allá de los permisos de cámara necesarios para el escáner.
            </p>
          </div>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          SICOAC - Gestión Integrada de Centros de Acopio
        </p>

      </div>
    </div>
  )
}
