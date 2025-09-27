'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, PlusCircle, Trash2, User, Phone } from 'lucide-react';
import type { Contact } from '@/lib/types';

interface EmergencyContactsProps {
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
}

const MAX_CONTACTS = 7;

export function EmergencyContacts({ contacts, setContacts }: EmergencyContactsProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddContact = () => {
    if (name && phone && contacts.length < MAX_CONTACTS) {
      const newContact: Contact = { id: crypto.randomUUID(), name, phone };
      setContacts([...contacts, newContact]);
      setName('');
      setPhone('');
      setIsOpen(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>
            Store up to {MAX_CONTACTS} contacts for SOS alerts.
          </CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" disabled={contacts.length >= MAX_CONTACTS}>
              <PlusCircle className="h-6 w-6" />
              <span className="sr-only">Add Contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Enter the name and phone number of your contact.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Jane Doe"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., +15551234567"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddContact} disabled={!name || !phone}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contacts.length > 0 ? (
          <ul className="space-y-4">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-background rounded-full">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  <div>
                    <p className="font-semibold text-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" />{contact.phone}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                  <Trash2 className="h-5 w-5 text-destructive/70 hover:text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No emergency contacts added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
