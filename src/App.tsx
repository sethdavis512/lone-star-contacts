import { useState } from 'react'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
} from 'lone-star-ui'

type Status = 'friend' | 'colleague' | 'family' | 'acquaintance'
type AvatarColor = 'sky' | 'longhorn' | 'pecan' | 'bluebonnet' | 'prickly-pear' | 'mesa'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  city: string
  status: Status
  color: AvatarColor
}

const STATUS_BADGE: Record<Status, Parameters<typeof Badge>[0]['variant']> = {
  friend: 'sky',
  colleague: 'longhorn',
  family: 'bluebonnet',
  acquaintance: 'pecan',
}

const SEED_CONTACTS: Contact[] = [
  { id: 1, name: 'Willie Nelson',    email: 'willie@austin.tx',    phone: '(512) 555-0101', city: 'Austin',         status: 'friend',       color: 'longhorn' },
  { id: 2, name: 'Selena Quintanilla', email: 'selena@corpuschristi.tx', phone: '(361) 555-0202', city: 'Corpus Christi', status: 'acquaintance', color: 'prickly-pear' },
  { id: 3, name: 'Matthew McConaughey', email: 'matthew@uvalde.tx',  phone: '(830) 555-0303', city: 'Uvalde',         status: 'colleague',    color: 'pecan' },
  { id: 4, name: 'Barbara Jordan',    email: 'barbara@houston.tx',  phone: '(713) 555-0404', city: 'Houston',        status: 'family',       color: 'bluebonnet' },
  { id: 5, name: 'Buddy Holly',       email: 'buddy@lubbock.tx',    phone: '(806) 555-0505', city: 'Lubbock',        status: 'friend',       color: 'sky' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const DEFAULT_FORM = { name: '', email: '', phone: '', city: '', status: 'friend' as Status }

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(SEED_CONTACTS)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(DEFAULT_FORM)
  const [adding, setAdding] = useState(false)
  const [deletedName, setDeletedName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const COLORS: AvatarColor[] = ['sky', 'longhorn', 'pecan', 'bluebonnet', 'prickly-pear', 'mesa']

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }
    setError(null)
    const newContact: Contact = {
      id: Date.now(),
      ...form,
      color: COLORS[contacts.length % COLORS.length],
    }
    setContacts(prev => [newContact, ...prev])
    setForm(DEFAULT_FORM)
    setAdding(false)
  }

  function handleDelete(contact: Contact) {
    setContacts(prev => prev.filter(c => c.id !== contact.id))
    setDeletedName(contact.name)
    setTimeout(() => setDeletedName(null), 3000)
  }

  return (
    <div className="min-h-screen bg-mesa/40 text-pecan font-sans">
      {/* Header */}
      <header className="bg-pecan text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✦</span>
          <h1 className="text-xl font-bold tracking-wide">Lone Star Contacts</h1>
        </div>
        <Badge variant="outline" className="border-white/40 text-white">
          {contacts.length} contacts
        </Badge>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Toast alerts */}
        {deletedName && (
          <Alert variant="warning">
            <AlertTitle>Contact removed</AlertTitle>
            <AlertDescription>{deletedName} was deleted from your contacts.</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="error">
            <AlertTitle>Hold your horses</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search + Add button */}
        <div className="flex gap-3">
          <Input
            placeholder="Search by name, city, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => { setAdding(a => !a); setError(null) }} variant={adding ? 'outline' : 'primary'}>
            {adding ? 'Cancel' : '+ Add Contact'}
          </Button>
        </div>

        {/* Add contact form */}
        {adding && (
          <Card>
            <CardHeader>
              <CardTitle>New Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Full name *"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <Input
                placeholder="Email *"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <Input
                placeholder="Phone"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              <Input
                placeholder="City"
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              />
              <select
                className="col-span-2 h-10 rounded-md border border-pecan/25 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-2"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
              >
                <option value="friend">Friend</option>
                <option value="colleague">Colleague</option>
                <option value="family">Family</option>
                <option value="acquaintance">Acquaintance</option>
              </select>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => { setAdding(false); setError(null); setForm(DEFAULT_FORM) }}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Save Contact</Button>
            </CardFooter>
          </Card>
        )}

        {/* Contact list */}
        {filtered.length === 0 ? (
          <Alert variant="info">
            <AlertTitle>No contacts found</AlertTitle>
            <AlertDescription>
              {search ? `No results for "${search}". Try a different search.` : 'Add your first contact above.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {filtered.map(contact => (
              <Card key={contact.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <Avatar
                    initials={getInitials(contact.name)}
                    color={contact.color}
                    size="lg"
                    alt={contact.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-pecan truncate">{contact.name}</span>
                      <Badge variant={STATUS_BADGE[contact.status]}>
                        {contact.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-pecan/60 truncate">{contact.email}</p>
                    <div className="flex gap-4 mt-1">
                      {contact.phone && <span className="text-xs text-pecan/50">{contact.phone}</span>}
                      {contact.city && <span className="text-xs text-pecan/50">{contact.city}, TX</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-prickly-pear hover:bg-prickly-pear/10 shrink-0"
                    onClick={() => handleDelete(contact)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

