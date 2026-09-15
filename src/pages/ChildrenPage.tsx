import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Award,
  Flame,
  Brain,
  CheckCircle2,
  X,
  MessageSquareHeart,
} from 'lucide-react';
import { useChild } from '../context/ChildContext';
import { Child } from '../types';
import { api } from '../services/api';
import { DigitalTwinVisual } from '../components/DigitalTwinVisual';
import { KidAvatar } from '../components/KidAvatar';

export const ChildrenPage: React.FC = () => {
  const { childrenList, selectedChild, setSelectedChild, refreshChildren, createChild } = useChild();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  // Form State for Add / Edit
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(7);
  const [gender, setGender] = useState('Not specified');
  const [interests, setInterests] = useState<string[]>(['Science', 'Space']);
  const [strengths, setStrengths] = useState<string[]>(['Creativity', 'Problem solving']);
  const [preferences, setPreferences] = useState<string[]>(['Visual', 'Interactive']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    'Science', 'Space', 'Mathematics', 'Reading', 'Art', 'Music', 'Technology', 'Sports', 'Nature', 'Robotics'
  ];
  const strengthOptions = [
    'Creativity', 'Problem solving', 'Communication', 'Memory', 'Logical thinking', 'Curiosity', 'Persistence'
  ];
  const preferenceOptions = [
    'Visual', 'Interactive', 'Reading', 'Games', 'Hands-on', 'Auditory'
  ];

  const openAddModal = () => {
    setName('');
    setAge(7);
    setGender('Not specified');
    setInterests(['Science', 'Space']);
    setStrengths(['Creativity', 'Problem solving']);
    setPreferences(['Visual', 'Interactive']);
    setEditingChild(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (child: Child) => {
    setName(child.name);
    setAge(child.age);
    setGender(child.gender || 'Not specified');
    setInterests(child.interests);
    setStrengths(child.strengths);
    setPreferences(child.learning_preferences);
    setEditingChild(child);
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingChild) {
        await api.updateChild(editingChild.id, {
          name: name.trim(),
          age: Number(age),
          gender,
          interests,
          strengths,
          learning_preferences: preferences,
        });
      } else {
        await createChild({
          name: name.trim(),
          age: Number(age),
          gender,
          interests,
          strengths,
          learning_preferences: preferences,
          avatar_color: '#1E3C65',
        });
      }
      await refreshChildren();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to save child profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (childId: string) => {
    if (confirm('Are you sure you want to delete this child profile and its Digital Twin data?')) {
      try {
        await api.deleteChild(childId);
        await refreshChildren();
      } catch (err) {
        console.error('Failed to delete child:', err);
      }
    }
  };

  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF001E]">
            Profiles & Neural Twins
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#010313] mt-0.5">
            My Children
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Manage your family’s individual learning profiles and Digital Twins.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Child Profile</span>
        </button>
      </div>

      {/* Children Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {childrenList.map((child) => {
          const isSelected = selectedChild?.id === child.id;
          return (
            <div
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer relative shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-[#FF001E] ring-2 ring-[#FF001E]/20 bg-gradient-to-b from-white to-[#FCEBE5]/20'
                  : 'border-[#F0F0F3] hover:border-[#1E3C65]/30'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF001E] text-white">
                    Active
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3.5 mb-4">
                <KidAvatar child={child} size="lg" shape="rounded" />
                <div>
                  <h3 className="text-base font-extrabold text-[#010313]">{child.name}</h3>
                  <span className="text-xs text-[#6B7280] font-semibold">{child.age} Years Old</span>
                </div>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#F8F8FA] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block">Points</span>
                  <span className="text-xs font-extrabold text-[#010313]">🌱 {child.bloom_points}</span>
                </div>
                <div className="bg-[#FCEBE5]/60 p-2.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-[#FF001E] block">Streak</span>
                  <span className="text-xs font-extrabold text-[#010313]">🔥 {child.learning_streak}d</span>
                </div>
              </div>

              {/* Interests & Strengths badges */}
              <div className="space-y-2 mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block mb-1">
                    Interests
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {child.interests.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F8F8FA] border border-[#E5E7EB] text-[#1E3C65]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block mb-1">
                    Strengths
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {child.strengths.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FCEBE5] text-[#FF001E]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F0F3]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(child);
                  }}
                  className="p-2 text-[#6B7280] hover:text-[#1E3C65] hover:bg-[#F8F8FA] rounded-lg transition-colors cursor-pointer"
                  title="Edit profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {childrenList.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(child.id);
                    }}
                    className="p-2 text-[#6B7280] hover:text-[#FF001E] hover:bg-[#FCEBE5]/50 rounded-lg transition-colors cursor-pointer"
                    title="Delete profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Child Living Digital Twin View */}
      {selectedChild && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#010313]">
                {selectedChild.name}’s Digital Twin Exploration
              </h2>
              <p className="text-xs text-[#6B7280]">
                Multidimensional neural map correlating developmental signals, strengths, and modalities.
              </p>
            </div>
            <button
              onClick={() => openEditModal(selectedChild)}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F8F8FA] text-xs font-bold text-[#1E3C65] flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Modify Twin Parameters</span>
            </button>
          </div>

          <DigitalTwinVisual child={selectedChild} />
        </div>
      )}

      {/* Add / Edit Child Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010313]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#F0F0F3] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#9CA3AF] hover:text-[#010313] rounded-full hover:bg-[#F8F8FA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF001E]">
                  {editingChild ? 'Update Digital Twin' : 'Create New Profile'}
                </span>
                <h3 className="text-xl font-extrabold text-[#010313]">
                  {editingChild ? `Edit ${editingChild.name}’s Profile` : 'Add Child Profile'}
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#010313] mb-1">Child Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Maya"
                  className="w-full text-xs text-[#010313] p-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#1E3C65]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#010313] mb-1">Age</label>
                  <input
                    type="number"
                    min="3"
                    max="16"
                    value={age}
                    onChange={(e) => setAge(Math.max(3, parseInt(e.target.value) || 3))}
                    className="w-full text-xs text-[#010313] p-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#1E3C65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#010313] mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-xs text-[#010313] p-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#1E3C65]"
                  >
                    <option value="Not specified">Prefer not to say</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              {/* Interests multi-toggle */}
              <div>
                <label className="block text-xs font-bold text-[#010313] mb-1.5">
                  Interests ({interests.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {interestOptions.map((item) => {
                    const sel = interests.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleArrayItem(interests, setInterests, item)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          sel
                            ? 'bg-[#FCEBE5] text-[#FF001E] border border-[#FF001E]/40'
                            : 'bg-[#F8F8FA] text-[#010313] border border-[#E5E7EB]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strengths multi-toggle */}
              <div>
                <label className="block text-xs font-bold text-[#010313] mb-1.5">
                  Strengths ({strengths.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {strengthOptions.map((item) => {
                    const sel = strengths.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleArrayItem(strengths, setStrengths, item)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          sel
                            ? 'bg-[#1E3C65] text-white'
                            : 'bg-[#F8F8FA] text-[#010313] border border-[#E5E7EB]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferences multi-toggle */}
              <div>
                <label className="block text-xs font-bold text-[#010313] mb-1.5">
                  Learning Modalities ({preferences.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {preferenceOptions.map((item) => {
                    const sel = preferences.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleArrayItem(preferences, setPreferences, item)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          sel
                            ? 'bg-[#010313] text-white'
                            : 'bg-[#F8F8FA] text-[#010313] border border-[#E5E7EB]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F0F0F3]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B7280] hover:text-[#010313]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#FF001E] hover:bg-[#E6001B] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
