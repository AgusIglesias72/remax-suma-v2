"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, User, Heart, Settings, LogOut } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PropertyCard from "@/components/property-card"
import { allProperties } from "@/lib/data"

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  // Propiedades favoritas (simuladas)
  const favoriteProperties = allProperties.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Foto de perfil"
                      fill
                      className="rounded-full object-cover border-4 border-white shadow"
                    />
                  </div>
                  <CardTitle>Carlos Rodríguez</CardTitle>
                  <CardDescription>Agente Inmobiliario</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#perfil">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#favoritos">
                        <Heart className="mr-2 h-4 w-4" />
                        Favoritos
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#notificaciones">
                        <Bell className="mr-2 h-4 w-4" />
                        Notificaciones
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#configuracion">
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Tabs defaultValue="perfil">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
                  <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
                  <TabsTrigger value="configuracion">Configuración</TabsTrigger>
                </TabsList>

                <TabsContent value="perfil">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input id="nombre" defaultValue="Carlos" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input id="apellido" defaultValue="Rodríguez" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="carlos.rodriguez@remaxsuma.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" defaultValue="+54 11 4567-8900" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bio">Biografía</Label>
                            <textarea
                              id="bio"
                              className="w-full px-3 py-2 border rounded-md h-32"
                              defaultValue="Agente inmobiliario con más de 5 años de experiencia en el mercado de Buenos Aires. Especializado en propiedades de lujo y zonas premium."
                            />
                          </div>
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700">Guardar cambios</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="favoritos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Propiedades Favoritas</CardTitle>
                      <CardDescription>Propiedades que has marcado como favoritas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteProperties.map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notificaciones">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferencias de Notificaciones</CardTitle>
                      <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Notificaciones</h3>
                            <p className="text-sm text-gray-500">Habilitar o deshabilitar todas las notificaciones</p>
                          </div>
                          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Notificaciones por email</h3>
                            <p className="text-sm text-gray-500">Recibir notificaciones por email</p>
                          </div>
                          <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                            disabled={!notificationsEnabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Notificaciones push</h3>
                            <p className="text-sm text-gray-500">Recibir notificaciones push en el navegador</p>
                          </div>
                          <Switch
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                            disabled={!notificationsEnabled}
                          />
                        </div>

                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-4">Tipos de notificaciones</h3>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="nuevas-propiedades"
                                className="rounded border-gray-300"
                                defaultChecked
                                disabled={!notificationsEnabled}
                              />
                              <label htmlFor="nuevas-propiedades">Nuevas propiedades</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="consultas"
                                className="rounded border-gray-300"
                                defaultChecked
                                disabled={!notificationsEnabled}
                              />
                              <label htmlFor="consultas">Consultas de clientes</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="cambios-precio"
                                className="rounded border-gray-300"
                                defaultChecked
                                disabled={!notificationsEnabled}
                              />
                              <label htmlFor="cambios-precio">Cambios de precio</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="visitas"
                                className="rounded border-gray-300"
                                defaultChecked
                                disabled={!notificationsEnabled}
                              />
                              <label htmlFor="visitas">Visitas programadas</label>
                            </div>
                          </div>
                        </div>

                        <Button className="bg-red-600 hover:bg-red-700">Guardar preferencias</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="configuracion">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de la cuenta</CardTitle>
                      <CardDescription>Administra la configuración de tu cuenta</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="cambiar-password">Cambiar contraseña</Label>
                          <div className="grid grid-cols-1 gap-4">
                            <Input id="password-actual" type="password" placeholder="Contraseña actual" />
                            <Input id="password-nueva" type="password" placeholder="Nueva contraseña" />
                            <Input id="password-confirmar" type="password" placeholder="Confirmar nueva contraseña" />
                          </div>
                          <Button className="mt-2 bg-red-600 hover:bg-red-700">Cambiar contraseña</Button>
                        </div>

                        <div className="pt-6 border-t">
                          <h3 className="font-medium mb-4">Idioma y región</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="idioma">Idioma</Label>
                              <select id="idioma" className="w-full px-3 py-2 border rounded-md">
                                <option value="es">Español</option>
                                <option value="en">Inglés</option>
                                <option value="pt">Portugués</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="moneda">Moneda</Label>
                              <select id="moneda" className="w-full px-3 py-2 border rounded-md">
                                <option value="ars">Peso Argentino (ARS)</option>
                                <option value="usd">Dólar Estadounidense (USD)</option>
                                <option value="eur">Euro (EUR)</option>
                              </select>
                            </div>
                          </div>
                          <Button className="mt-4 bg-red-600 hover:bg-red-700">Guardar preferencias</Button>
                        </div>

                        <div className="pt-6 border-t">
                          <h3 className="font-medium text-red-600 mb-2">Zona de peligro</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de estar seguro.
                          </p>
                          <Button variant="destructive">Eliminar cuenta</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
