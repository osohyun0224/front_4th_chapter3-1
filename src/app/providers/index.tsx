import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { EventProvider } from "@/app/providers/Event/EventProvider"

type ProvidersProps = {
  children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <EventProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </EventProvider>
  );
};
